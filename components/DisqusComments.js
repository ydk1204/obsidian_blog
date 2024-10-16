import { DiscussionEmbed } from 'disqus-react'

export default function DisqusComments({ slug, title }) {
  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME // 환경 변수에서 가져오기
  const disqusConfig = {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`, // 실제 사이트 URL로 변경
    identifier: slug,
    title: title
  }

  return <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
}
