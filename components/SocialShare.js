import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa'

export default function SocialShare({ url, title }) {
  return (
    <div className="flex space-x-4 mt-4">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-600"
      >
        <FaTwitter size={24} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        <FaFacebook size={24} />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-900"
      >
        <FaLinkedin size={24} />
      </a>
    </div>
  )
}
