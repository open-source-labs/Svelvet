module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '1rem'
		},
		fontFamily: {
			inter: ['Inter', 'sans-serif'],
			nunito: ['Nunito', 'sans-serif']
		},
		extend: {
			screens: {
				contributors: { raw: '(min-width: 935px)' }
			},
			colors: {
				primary: '#ff4561',
			}
		}
	},
	plugins: []
};
