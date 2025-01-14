import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class CommonHelmet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tailwindLoaded: false
    };
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com/3.4.5?plugins=forms@0.5.7,typography@0.5.13,aspect-ratio@0.4.2,container-queries@0.1.1";
    script.onload = () => {
      if (window.tailwind) {
        window.tailwind.config={theme:{extend:{colors:{primary:'#766DE8'},borderRadius:{'none':'0px','sm':'2px',DEFAULT:'2px','md':'8px','lg':'12px','xl':'16px','2xl':'20px','3xl':'24px','full':'9999px','button':'4px'}}}}
        this.setState({ tailwindLoaded: true });
      }
    };
    document.head.appendChild(script);
  }

  render() {
    return (
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://ai-public.mastergo.com/gen_page/tailwind-custom.css" rel="stylesheet" />
      </Helmet>
    );
  }
}

export default CommonHelmet;