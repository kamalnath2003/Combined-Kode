// javaCompletionProvider.js

export const javaCompletionProvider = (monaco) => {
  monaco.languages.registerCompletionItemProvider('java', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        {
          label: 'System.out.println',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'System.out.println(${1:message});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Prints the message to the console',
          detail: 'void println(String x)',
        }, {
          label: 'int',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'int ${1:variableName}',
          documentation: 'Primitive data type for integers',
        },
        {
          label: 'String',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'String ${1:variableName}',
          documentation: 'Class for strings',
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'for (${1:int i = 0; i < ${2:10}; i++}) {\n\t${3: // code }\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Looping construct',
        }, {
          label: 'main method',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'public static void main(String[] args) {\n\t${1:// code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Main method entry point',
        },
        {
          label: 'try-catch block',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try {\n\t${1:// code}\n} catch (${2:Exception e}) {\n\t${3:// handle exception}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Exception handling block',
        },
        // Add more keywords and variable names here
    
        {
          label: 'Math.max',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'Math.max(${1:num1}, ${2:num2})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Returns the greater of two int values',
          detail: 'int max(int a, int b)',
        }, {
          label: 'ArrayList',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'ArrayList<${1:Type}>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'A resizable array implementation of the List interface',
          detail: 'class java.util.ArrayList',
        },
        {
          label: 'HashMap',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'HashMap<${1:KeyType}, ${2:ValueType}>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'A hash table based implementation of the Map interface',
          detail: 'class java.util.HashMap',
        },
        // Add more method signatures here
      ];
      return { suggestions };
    },
  });
};
