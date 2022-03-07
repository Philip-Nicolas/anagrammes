const { getAllowedWords } = require('../src/words/utils');

// noinspection SpellCheckingInspection
const tests = [
  {
    name: "getAllowedWords",
    invoke: (args) => getAllowedWords(args.letters, args.wordlist),
    validate: (result, expected) => {
      for (const word of result) {
        if (!expected.includes(word)) {
          throw new Error("Unexpected word in results array.");
        }
      }
    },
    testCases: [{
      name: "eliminates words longer than available characters (3 chars)",
      args: {
        letters: "xyz",
        wordlist: [
          "xyz",
          "xxxx",
          "yx",
          "zyx",
          "xyzw",
          "xyzz",
        ],
      },
      expected: [
        "xyz",
        "yx",
        "zyx",
      ],
    }, {
      name: "eliminates words longer than available characters (6 chars)",
      args: {
        letters: "abcdef",
        wordlist: [
          "abc",
          "abcdefa",
          "abcde",
          "aaaaaaaaaaa",
          "fffffffffff",
          "eeeeeeeeeee",
          "",
          "f",
          "bac",
          "abcdef",
          "decafb",
          "fedcba",
        ],
      },
      expected: [
        "abc",
        "abcde",
        "",
        "f",
        "bac",
        "abcdef",
        "decafb",
        "fedcba",
      ],
    }, {
      name: "eliminates words with invalid letters",
      args: {
        letters: "ba",
        wordlist: [
          "ab",
          "be",
          "ba",
          "a",
          "f",
        ],
      },
      expected: [
        "ab",
        "ba",
        "a",
      ],
    }, {
      name: "eliminates words with too many of a letter",
      args: {
        letters: "decaf",
        wordlist: [
          "cafae",
          "decaf",
          "cab",
          "cefafd",
          "add",
          "dead",
          "faced",
        ],
      },
      expected: [
        "decaf",
        "faced",
        "cab",
      ],
    },
    ]
  }
]

// region Test Running

// Run a test case.
// Replaces invoke and validate functions with custom functions defined in test case, if present.
function runTestCase(testCase, invoke, validate, handleSuccess, handleFailure) {
  invoke = testCase.invoke || invoke;
  validate = testCase.validate || validate;

  try {
    validate(invoke(testCase.args), testCase.expected);
    handleSuccess();
  } catch (e) {
    handleFailure(e)
  }
}

function logSuccess() {
  console.log("\t\t✅ PASSED");
}

function logFailure(e) {
  console.log(`\t\t❎ FAILED: ${e.message}`);
  console.error(e);
}

function runTest(test) {
  console.log(`RUNNING TEST: ${test.name}`);

  for (const testCase of test.testCases) {
    console.log(`\t${testCase.name}`);
    runTestCase(testCase, test.invoke, test.validate, logSuccess, logFailure);
  }
}

function runTests(tests) {
  for (const test of tests) {
    runTest(test);
  }
}

// endregion

runTests(tests);