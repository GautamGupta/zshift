'use strict';


module.exports = {
	app: {
		title: 'zShift',
		description: 'Pay per Shift',
		keywords: 'Shift, Hospitality, Payment',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	integrations: {
		braintree: {
			public_key: process.env.BRAINTREE_PUBLIC,
			private_key: process.env.BRAINTREE_PRIVATE,
			merchant_id: process.env.BRAINTREE_MERCHANT,
		}
	}
};
