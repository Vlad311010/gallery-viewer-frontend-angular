import * as path from "path";
import { VariableDeclarationKind, Scope } from "ts-morph";

const tsType = (parameter: (typeof parameters)[number]) => {
    const { type, format } = parameter.schema;

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

const urlTemplate = (operation) => operation.path.replace(
  /\{([^}]+)\}/g,
  (_, name: string) => `\${${name}}`,
);


export class UrlsPlugin {
    private readonly context;

    constructor(context) {
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

        const classDeclaration = file.addClass({
            name: "ApiUrls",
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

          const variableName =
              `${method}${operationId.charAt(0).toUpperCase()}${operationId.slice(1)}Url`;
            
          const url = urlTemplate(operation);
          const methodParameters = operation.parameters
            .filter((parameter) => parameter.in === "path")
            .map((parameter) => ({
              name: parameter.name,
              type: tsType(parameter),
            }));
          
          classDeclaration.addMethod({
              name: variableName,
              scope: Scope.Public,
              parameters: methodParameters,
              returnType: "string",
              statements: [
                  `return \`\${this.basePath}${url}\`;`,
              ]
          });
        }

        file.formatText();
    }
}