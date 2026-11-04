import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  defer,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  startWith, 
  switchMap} 
from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface RequestStateOptions {
  errorMessage?: string;
  onLoadStart?: () => void;
}

interface ApiError {
  status: number
  details?: string
  title: string 
}

export function toRequestState<TSource, TResponse>(
  source: Observable<TSource>,
  request: (value: TSource) => Observable<TResponse>,
  options: RequestStateOptions = {}
): Signal<RequestState<TResponse>> {
  return toSignal(
    source.pipe(
      distinctUntilChanged(),
      switchMap(value =>
        request(value)
        .pipe(toRequestStateOperator<TResponse>(options))
      )
    ),
    {
      initialValue: {
        data: null,
        loading: true,
        error: null
      }
    }
  );
}

function toRequestStateOperator<T>(options: RequestStateOptions = {}): OperatorFunction<T, RequestState<T>> {
  const initialState: RequestState<T> = {
    data: null,
    loading: true,
    error: null
  };

  return (source: Observable<T>) =>
    defer(() => {
      options.onLoadStart?.();
      return source;
    }).pipe(
      map(data => ({
        data,
        loading: false,
        error: null
      })),
      startWith(initialState),
      catchError((error: unknown) => of({
        data: null,
        loading: false,
        error: getErrorMessage(error, options.errorMessage)
      }))
    );
}

function getErrorMessage(
  error: unknown,
  fallbackMessage?: string
): ApiError {
  const defaultTitle = 'Request Failed';
  if (error instanceof HttpErrorResponse) {
    return {
      status: error.status ?? 500,
      title: error.name || defaultTitle,
      details: fallbackMessage
    };
  }

  return {
    status: 500,
    title: defaultTitle,
    details: fallbackMessage
  };
}