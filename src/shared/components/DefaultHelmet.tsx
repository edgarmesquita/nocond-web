import React from "react";
import { Helmet } from "react-helmet";
import { metaTags } from "../../utils";
const DefaultHelmet = () => {
    return (
        <Helmet>
            <title>{metaTags.title}</title>
            <meta name="title" content={metaTags.title} />
            <meta name="description" content={metaTags.description} />
            <meta name="keywords" content={metaTags.keywords} />
            <meta name="author" content={metaTags.author} />
            <meta property="og:title" content={metaTags.title} />
            <meta property="og:description" content={metaTags.description} />
            <meta property="og:site_name" content={metaTags.title} />
            <meta property="og:locale" content="pt_BR" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={metaTags.site} />
            <meta property="fb:app_id" content={metaTags.fbId} />
        </Helmet>
    );
}

export default DefaultHelmet;