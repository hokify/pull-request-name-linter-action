const Project = require("@lerna/project");
const fs = require("fs");

const POC_FOLDER_PATH = "poc";

/**
 * Enum for scope requirements.
 */
const scopeRequirements = {
  REQUIRED: "required",
  OPTIONAL: "optional",
  FORBIDDEN: "forbidden"
};

/**
 * Valid types of commits with their scope requirements.
 */
const COMMIT_TYPES = {
  build: {
    name: "build",
    scope: scopeRequirements.OPTIONAL
  },
  release: {
    name: "release",
    scope: scopeRequirements.FORBIDDEN
  },
  docs: {
    name: "docs",
    scope: scopeRequirements.OPTIONAL
  },
  feat: {
    name: "feat",
    scope: scopeRequirements.REQUIRED
  },
  fix: {
    name: "fix",
    scope: scopeRequirements.REQUIRED
  },
  perf: {
    name: "perf",
    scope: scopeRequirements.REQUIRED
  },
  refactor: {
    name: "refactor",
    scope: scopeRequirements.REQUIRED
  },
  style: {
    name: "style",
    scope: scopeRequirements.OPTIONAL
  },
  test: {
    name: "test",
    scope: scopeRequirements.OPTIONAL
  },
  prot: {
    name: "prot",
    scope: scopeRequirements.REQUIRED
  },
  revert: {
    name: "revert",
    scope: scopeRequirements.FORBIDDEN
  },
};

/**
 * Our custom scopes
 */
const CUSTOM_SCOPES = ["packaging", "dev-docs"];

/**
 * Array of valid types.
 */
const types = Object.keys(COMMIT_TYPES);

/**
 * Construct the scopes array from the custom scopes, lerna package names and POC folder names.
 */
async function getScopes() {
  const lernaPackages = (await new Project().getPackages())
    .map(package => package.name)
    .map((name) => (name.charAt(0) === '@' ? name.split('/')[1] : name));
  const customScopes = CUSTOM_SCOPES;
  const pocs = fs.readdirSync(POC_FOLDER_PATH, { withFileTypes: true })
    .filter(file => file.isDirectory()).map(directory => directory.name);

  return [].concat(lernaPackages, customScopes, pocs);
}

/**
 * This rule checks if the scopes were used correctly.
 * @param type type of the commit
 * @param scope optional scope of the commit message
 */
function scopeRequirementRule({ type, scope }) {
  const scopeRequirement = COMMIT_TYPES[type].scope;

  if (scopeRequirement === scopeRequirements.FORBIDDEN && scope) {
    return [false, `scopes are forbidden for commits with type '${type}', but a scope of '${scope}' was provided`];
  }

  if (scopeRequirement === scopeRequirements.REQUIRED && !scope) {
    return [false, `scopes are required for commits with type '${type}', but no scope was provided`];
  }

  return [true];
}

module.exports = {
  extends: ["@commitlint/config-angular"],
  rules: {
    'scope-requirement-rule': [2, 'always'],
    'type-enum': [2, 'always', types],
    'scope-enum': getScopes().then(scopes => [2, 'always', scopes])
  },
  plugins: [
    {
      rules: {
        'scope-requirement-rule': scopeRequirementRule
      }
    }
  ]
};
