import Script from 'next/script';

const GoogleAnalytics = () => {
	return (
		<>
			<Script id="gtm-script" strategy="afterInteractive">
				{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PDL43QC4');`}
			</Script>
			<noscript>
				<iframe
					src="https://www.googletagmanager.com/ns.html?id=GTM-PDL43QC4"
					height="0"
					width="0"
					style={{ display: 'none', visibility: 'hidden' }}
					title="GTM"
				></iframe>
			</noscript>
		</>
	);
};

export default GoogleAnalytics;
