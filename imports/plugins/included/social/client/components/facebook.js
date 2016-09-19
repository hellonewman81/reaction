import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import Helmet from "react-helmet";
import classnames from "classnames";
import { Translation } from "/imports/plugins/core/ui/client/components";

export function getOpenGraphMeta(props) {
  const url = props.url || location.origin + location.pathname;
  const title = props.title || document.title;
  const description = props.settings.description;

  let meta = [
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: location.hostname },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description }
  ];


  if (props.media) {
    if (!/^http(s?):\/\/+/.test(data.media)) {
      media = location.origin + data.media;
    }

    meta.push({
      property: "og:image",
      content: media
    });
  }

  return meta;
}

class FacebookSocialButton extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (window && document && this.props.isEnabled) {
      $('<div id="fb-root"></div>').appendTo("body");

      window.fbAsyncInit = function () {
        return FB.init({
          appId: apps.facebook.appId,
          xfbml: true,
          version: "v2.1"
        });
      };
      (function (d, s, id) {
        let js = void 0;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }

  handleClick = (event) => {
    event.preventDefault();
    console.log("FB Button", this.props);
    if (FB) {
      FB.ui({
        method: "share",
        display: "popup",
        href: this.props.url
      }, function (response) {
        //
      });
    }
  }

  renderText() {
    if (this.props.showText) {
      return (
        <Translation defaultValue="Share on Facebook" i18nKey="social.shareOnFacebook" />
      )
    }
  }

  render() {
    const iconClassNames = classnames({
      "fa": true,
      "fa-facebook": this.props.altIcon !== true,
      "fa-facebook-alt": this.props.altIcon,
      [this.props.size]: this.props.size
    });

    return (
      <a className="btn btn-flat facebook-share" href="#" onClick={this.handleClick} target="_blank">
        <Helmet
          meta={getOpenGraphMeta(this.props)}
        />
        <i className={iconClassNames} />
        {this.renderText()}
      </a>
    );
  }
}

export default FacebookSocialButton
