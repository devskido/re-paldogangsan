'use client';

import { CheckCircle, MapPin, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';

export default function AboutPage() {
  const stats = [
    { label: '지자체 쇼핑몰', value: '100+', icon: ShoppingBag },
    { label: '등록 상품', value: '50,000+', icon: ShoppingBag },
    { label: '전국 시·도', value: '17', icon: MapPin },
    { label: '실시간 업데이트', value: '24/7', icon: CheckCircle }
  ];

  const steps = [
    {
      number: '1',
      title: '지자체 쇼핑몰 통합',
      description: '전국 100개 이상의 지자체 쇼핑몰에서 판매하는 상품을 하나의 플랫폼에서 모아 제공합니다.',
      icon: ShoppingBag
    },
    {
      number: '2',
      title: '스마트 검색 시스템',
      description: '한글 최적화 검색으로 원하는 지역 특산품을 빠르고 정확하게 찾아볼 수 있습니다.',
      icon: Search
    },
    {
      number: '3',
      title: '지역별 탐색',
      description: '인터랙티브 지도를 통해 각 지역의 특산품을 쉽게 탐색하고 비교할 수 있습니다.',
      icon: MapPin
    }
  ];

  const faqItems = [
    {
      question: 'K-Mall Aggregator는 어떤 서비스인가요?',
      answer: '전국 100개 이상의 지자체 쇼핑몰에서 판매하는 상품을 한 곳에서 검색하고 비교할 수 있는 통합 플랫폼입니다. 각 지역의 특산품을 쉽게 찾아볼 수 있도록 도와드립니다.'
    },
    {
      question: '상품을 직접 구매할 수 있나요?',
      answer: '저희는 상품 정보를 제공하는 플랫폼으로, 직접 판매는 하지 않습니다. 원하시는 상품을 클릭하면 해당 지자체 쇼핑몰로 연결되어 구매하실 수 있습니다.'
    },
    {
      question: '상품 정보는 얼마나 자주 업데이트되나요?',
      answer: '상품 정보는 매일 자동으로 업데이트됩니다. 각 지자체 쇼핑몰의 최신 정보를 반영하여 항상 정확한 정보를 제공하도록 노력하고 있습니다.'
    },
    {
      question: '특정 지역의 상품만 볼 수 있나요?',
      answer: '네, 가능합니다. 홈페이지의 지도를 클릭하거나 검색 필터를 사용하여 원하시는 지역의 상품만 선택적으로 볼 수 있습니다.'
    },
    {
      question: '검색이 잘 안 될 때는 어떻게 하나요?',
      answer: '한글 검색에 최적화되어 있으며, 띄어쓰기 없이 검색해도 결과를 찾을 수 있습니다. 또한 초성 검색도 지원하므로 "ㅎㅇ"로 "한우"를 검색할 수 있습니다.'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            K-Mall Aggregator 소개
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            대한민국 지자체 쇼핑몰의 모든 상품을 한 곳에서 만나볼 수 있는
            <br />
            통합 플랫폼입니다.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            우리가 함께하는 숫자들
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            이렇게 탐색하세요
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            세 단계로 빠르고 쉽게 원하는 지역 특산품을 찾아보세요
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-300">
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-l-4 border-transparent border-l-gray-300"></div>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                      <span className="text-3xl font-bold text-blue-600">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              우리의 대사명
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              K-Mall Aggregator는 전국 각 지역의 우수한 특산품을 더 많은 사람들에게 소개하고,
              지역 경제 활성화에 기여하고자 합니다.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              복잡한 쇼핑 경험을 단순하게 만들어, 모든 사용자가 편리하게
              지역 특산품을 찾고 구매할 수 있는 환경을 제공합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                상품 검색하기
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            자주 묻는 질문
          </h2>
          <FAQAccordion items={faqItems} />
        </div>
      </section>
    </main>
  );
}