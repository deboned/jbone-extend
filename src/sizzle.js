/**
 * Created by Paul on 4/11/2015.
 */

jBone.expr = {};
var whitespace = "[\\x20\\t\\r\\n\\f]";
var characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";
var identifier = characterEncoding.replace( "w", "w#" );
var attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
    // Operator (capture 2)
  "*([*^$|!~]?=)" + whitespace +
    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
  "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
  "*\\]";
jBone.expr[":"] = ":(" + characterEncoding + ")(?:\\((" +
  // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
  // 1. quoted (capture 3; capture 4 or capture 5)
"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
  // 2. simple (capture 6)
"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
  // 3. anything else (capture 2)
".*" +
")\\)|)";