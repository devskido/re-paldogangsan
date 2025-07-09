import Link from 'next/link';
import { MapPin, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const regions = [
    { name: '서울', href: '/?region=seoul' },
    { name: '경기', href: '/?region=gyeonggi' },
    { name: '인천', href: '/?region=incheon' },
    { name: '강원', href: '/?region=gangwon' },
    { name: '충북', href: '/?region=chungbuk' },
    { name: '충남', href: '/?region=chungnam' },
    { name: '세종', href: '/?region=sejong' },
    { name: '대전', href: '/?region=daejeon' },
    { name: '전북', href: '/?region=jeonbuk' },
    { name: '전남', href: '/?region=jeonnam' },
    { name: '광주', href: '/?region=gwangju' },
    { name: '경북', href: '/?region=gyeongbuk' },
    { name: '경남', href: '/?region=gyeongnam' },
    { name: '대구', href: '/?region=daegu' },
    { name: '울산', href: '/?region=ulsan' },
    { name: '부산', href: '/?region=busan' },
    { name: '제주', href: '/?region=jeju' }
  ];

  const quickLinks = [
    { name: '홈', href: '/' },
    { name: '검색', href: '/search' },
    { name: '카테고리', href: '/categories' },
    { name: '쇼핑몰', href: '/malls' },
    { name: '소개', href: '/about' },
    { name: '문의', href: '/contact' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">
              K-Mall <span className="text-blue-400">Aggregator</span>
            </h2>
            <p className="text-gray-400 mb-4">
              대한민국 지자체 쇼핑몰의
              <br />
              모든 상품을 한 곳에서
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm">support@kmall-aggregator.kr</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">빠른 메뉴</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Links */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              지역별 상품 보기
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {regions.map((region) => (
                <Link
                  key={region.name}
                  href={region.href}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-1 rounded transition-all text-sm text-center"
                >
                  {region.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 K-Mall Aggregator. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}