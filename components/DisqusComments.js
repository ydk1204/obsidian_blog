import { useEffect, useRef } from 'react';
import { DiscussionEmbed } from 'disqus-react'

export default function DisqusComments({ slug, title }) {
  const disqusRef = useRef(null);
  const isIntersecting = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isIntersecting.current) {
          isIntersecting.current = true;
          // Disqus 스크립트 지연 로드
          const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;
          const disqusConfig = {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`,
            identifier: slug,
            title: title
          };
          
          if (disqusRef.current) {
            disqusRef.current.innerHTML = '';
            const d = document.createElement('div');
            d.id = 'disqus_thread';
            disqusRef.current.appendChild(d);
            
            window.disqus_config = function() {
              this.page.url = disqusConfig.url;
              this.page.identifier = disqusConfig.identifier;
              this.page.title = disqusConfig.title;
            };
            
            const script = document.createElement('script');
            script.src = `https://${disqusShortname}.disqus.com/embed.js`;
            script.setAttribute('data-timestamp', +new Date());
            document.body.appendChild(script);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (disqusRef.current) {
      observer.observe(disqusRef.current);
    }

    return () => {
      if (disqusRef.current) {
        observer.unobserve(disqusRef.current);
      }
    };
  }, [slug, title]);

  return <div ref={disqusRef} />;
}
