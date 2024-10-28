import { FaFacebook, FaLinkedin, FaLine, FaLink } from 'react-icons/fa'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { FaXTwitter } from 'react-icons/fa6'  // fa6에서 직접 임포트
import { useState, useEffect } from 'react'

export default function SocialShare({ url, title }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // 카카오 SDK 초기화
    if (typeof window !== 'undefined' && !window.Kakao?.isInitialized()) {
      const script = document.createElement('script')
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
      script.async = true
      script.onload = () => {
        if (process.env.NEXT_PUBLIC_KAKAO_KEY) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY)
        }
      }
      document.head.appendChild(script)
    }
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleKakaoShare = () => {
    try {
      if (window.Kakao?.isInitialized()) {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: title,
            description: '이 글을 확인해보세요!',
            imageUrl: 'https://unknown97.pages.dev/og-image.jpg',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
          ],
        })
      } else {
        console.error('Kakao SDK not initialized')
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Kakao share error:', error)
      window.open(url, '_blank')
    }
  }

  const handleEmailShare = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`안녕하세요,\n\n다음 글을 공유합니다:\n${title}\n\n링크: ${url}`)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="flex space-x-4 mt-4">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-gray-700"
        aria-label="twitter x"
      >
        <FaXTwitter size={24} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
        aria-label="facebook"
      >
        <FaFacebook size={24} />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-900"
        aria-label="linkedin"
      >
        <FaLinkedin size={24} />
      </a>
      <a
        href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 hover:text-green-700"
        aria-label="Line"
      >
        <FaLine size={24} />
      </a>
      <button
        onClick={handleKakaoShare}
        className="text-yellow-400 hover:text-yellow-600"
        aria-label="kakao"
      >
        <RiKakaoTalkFill size={24} />
      </button>
      <button
        onClick={handleCopyLink}
        className="text-gray-500 hover:text-gray-700 relative"
        aria-label="Copy link"
      >
        <FaLink size={21} />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
            Copied!
          </span>
        )}
      </button>
    </div>
  )
}
