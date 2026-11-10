import * as path from "path";
import { Scope, ClassDeclaration, StructureKind } from "ts-morph";
import type { ParameterDeclarationStructure, TypeAliasDeclaration } from "ts-morph";
import type { NormalizedOperation, Parameter, PluginGeneratorContext } from "ng-openapi";

const tsType = (parameter: Parameter) => {
    const type = parameter.schema?.type;

    switch (type) {
        case "integer":
        case "number":
            return "number";
        case "boolean":
            return "boolean";
        case "string":
            return "string";
        default:
            return "unknown";
    }
};

const urlTemplate = (operation: NormalizedOperation) => operation.path.replace(
  /\{([^}]+)\}/g,
  (_, name: string) => `\${${name}}`,
);


export class UrlsPlugin {
    private readonly context;

    constructor(context: PluginGeneratorContext) {
        this.context = context;
    }

    async generate(outputRoot: string): Promise<void> {
        const { spec, project, onWarning } = this.context;

        if (spec.operations.length === 0) {
            onWarning?.("Nothing to generate: the specification has no operations");
            return;
        }

        const file = project.createSourceFile(path.join(outputRoot, "urls", "index.ts"), "", {
            overwrite: true,
        });

        file.addImportDeclaration({
          moduleSpecifier: "@angular/core",
          namedImports: ["Injectable", "inject"],
        });

        file.addImportDeclaration({
          moduleSpecifier: "../tokens",
          namedImports: ["BASE_PATH_DEFAULT"],
        });

        const queryKeyDescriptorType = file.addTypeAlias({
          name: "QueryKeyDescriptor",
          isExported: true,
          type: `[
            url: string,
            parameters: Record<string, unknown>
          ]`
        });

        const classDeclaration = file.addClass({
            name: "ApiUrlsService",
            isExported: true,
            decorators: [
                {
                    name: "Injectable",
                    arguments: ["{ providedIn: 'root' }"],
                },
            ],
        });

        classDeclaration.addProperty({
            name: "basePath",
            scope: Scope.Private,
            isReadonly: true,
            initializer: "inject(BASE_PATH_DEFAULT)",
        });

        
        for (const operation of spec.operations) {
          const method = operation.method.toLowerCase();
          const operationId = operation.operationId;

          if (!operationId || !operation.path) {
            onWarning?.(
                `Skipping operation without operationId or path: ${operation.method} ${operation.path}`,
            );
            continue;
          }

          const urlGetterName =
            `${method}${operationId.charAt(0).toUpperCase()}${operationId.slice(1)}Url`;
          const queryKeyGetterName =
            `${method}${operationId.charAt(0).toUpperCase()}${operationId.slice(1)}QueryKey`;
          const queryKeyName =
            `${method}${operationId.charAt(0).toUpperCase()}${operationId.slice(1)}`;
            
          const url = urlTemplate(operation);
          let methodParameters : ParameterDeclarationStructure[] | undefined = undefined;
          if (operation.parameters) {
            methodParameters = operation.parameters
            .filter((parameter) => parameter.in === "path")
            .map((parameter) => ({
              name: parameter.name,
              type: tsType(parameter),
              kind: StructureKind.Parameter
            }));
          }
          
          this.generateUrlGetter(classDeclaration, urlGetterName, url, methodParameters);
          this.generateQueryKeyGetter(classDeclaration, queryKeyDescriptorType, queryKeyGetterName, queryKeyName, methodParameters);
        }


        file.formatText();
    }

    private generateUrlGetter(
      classDeclaration: ClassDeclaration,
      name: string,
      url: string,
      methodParameters?: ParameterDeclarationStructure[]
    ) {
      classDeclaration.addMethod({
        name: name,
        scope: Scope.Public,
        parameters: methodParameters,
        returnType: "string",
        statements: [
          `return \`\${this.basePath}${url}\`;`,
        ]
      });
    }

    private generateQueryKeyGetter(
      classDeclaration: ClassDeclaration,
      returnType: TypeAliasDeclaration,
      name: string,
      keyName: string,
      methodParameters?: ParameterDeclarationStructure[]
    ) {
      classDeclaration.addMethod({
        name: name  ,
        scope: Scope.Public,
        parameters: methodParameters,
        returnType: returnType.getName(),
        statements: [
          `return [
            "${keyName}",
            { ${(methodParameters ?? []).map(p => `${p.name}: ${p.name}`).join(", ")} }
          ];`
        ]
      });
    }

}

interface ParameterData {
    name: string;
    type: string;
}