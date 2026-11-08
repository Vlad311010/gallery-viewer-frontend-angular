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
  switchMap,
  tap} 
from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface RequestStateOptions<T> {
  errorMessage?: string;
  onLoadStart?: () => void;
  onSuccess?: (data : T) => void
}

interface ApiError {
  status: number
  details?: string
  title: string 
}

export function toRequestStateOnce<TResponse, TReturn = TResponse>(
  request: Observable<TResponse>,
  options: RequestStateOptions<TResponse> = {}
): Signal<RequestState<TResponse>> {
  return toSignal(
    request.pipe(
      toRequestStateOperator<TResponse>(options)
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

// TODO: refactor
export function toRequestStateOnceWithTransoformation<TResponse, TReturn>(
  request: Observable<TResponse>,
  transform: (response : TResponse | null) => TReturn,  
  options: RequestStateOptions<TReturn> = {}
): Signal<RequestState<TReturn>> {
  return toSignal(
    request.pipe(
      toRequestStateOperatorWithTransformation<TResponse, TReturn>(transform, options)
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

export function toRequestData<TSource, TResponse>(
  source: Observable<TSource>,
  request: (value: TSource) => Observable<TResponse>,
  fallbackValue: TResponse | null 
): Signal<TResponse | null> {
  return toSignal(
    source.pipe(
      distinctUntilChanged(),
      switchMap(value => 
        request(value).pipe(
           catchError(() => of(fallbackValue))
        )
      )
    ),
    { initialValue: null }
  );
}

export function toRequestState<TSource, TResponse>(
  source: Observable<TSource>,
  request: (value: TSource) => Observable<TResponse>,
  options: RequestStateOptions<TResponse> = {}
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

function toRequestStateOperator<T>(options: RequestStateOptions<T> = {}): OperatorFunction<T, RequestState<T>> {
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
      tap(data => options.onSuccess?.(data)),
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

function toRequestStateOperatorWithTransformation<TRequest, TReturn>(
  transform: (response : TRequest | null) => TReturn, 
  options: RequestStateOptions<TReturn> = {})
  : OperatorFunction<TRequest, RequestState<TReturn>> {
  const initialState: RequestState<TRequest> = {
    data: null,
    loading: true,
    error: null
  };

  return (source: Observable<TRequest>) =>
    defer(() => {
      options.onLoadStart?.();
      return source;
    }).pipe(
      map(data => transform(data)),
      tap(data => options.onSuccess?.(data)),
      map(data => ({
        data,
        loading: false,
        error: null
      })),
      startWith({
        data: transform(initialState.data),
        loading: initialState.loading,
        error: initialState.error
      }),
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