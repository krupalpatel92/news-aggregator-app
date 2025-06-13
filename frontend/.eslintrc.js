module.exports = {
	/* Specifies the ESLint parser */
	parser: '@typescript-eslint/parser',
	extends: [
		/* Uses the recommended rules from @eslint-plugin-react */
		'plugin:react/recommended',
		/* Uses the recommended rules from @typescript-eslint/eslint-plugin */
		'plugin:@typescript-eslint/recommended',
		/* Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array. */
		'plugin:prettier/recommended',
	],
	parserOptions: {
		/* Allows for the parsing of modern ECMAScript features */
		ecmaVersion: 2018,
		/* Allows for the use of imports */
		sourceType: 'module',
		ecmaFeatures: {
			/* Allows for the parsing of JSX */
			jsx: true,
		},
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		'react/prop-types': 'off',
		'react/no-children-prop': 'off',
		'react/react-in-jsx-scope': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
	},
	settings: {
		react: {
			/* Tells eslint-plugin-react to automatically detect the version of React to use */
			version: 'detect',
		},
	},
};
