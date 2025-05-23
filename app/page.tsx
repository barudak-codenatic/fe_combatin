import { Navbar } from "@/components/common/index";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/martial-arts-bg.jpg" 
            alt="Bela Diri Background" 
            fill 
            className="object-cover brightness-40"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-1"></div>
        
        <div className="container mx-auto px-6 z-10 relative">
          <div className="max-w-2xl text-white">
            <h1 className="text-6xl font-bold mb-6 leading-tight">Kuasai Seni <span className="text-red-500">Bela Diri</span></h1>
            <p className="text-xl mb-10 text-gray-200">Pelajari teknik bela diri dari para ahli dan tingkatkan kemampuan bertarungmu dengan teknologi AI terkini</p>
            <div className="flex gap-4">
              <Link href="/training" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 inline-block shadow-lg transform hover:-translate-y-1">
                Mulai Latihan
              </Link>
              <Link href="/about" className="border-2 border-white hover:bg-white hover:text-red-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 inline-block shadow-lg transform hover:-translate-y-1">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Platform belajar bela diri dengan teknologi AI yang membantu Anda menguasai teknik dengan lebih cepat dan efektif</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-600 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">Latihan Teknik</h3>
              <p className="text-gray-600 text-center">Pelajari berbagai teknik bela diri dengan panduan langkah demi langkah dari instruktur profesional.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-600 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">Deteksi Gerakan</h3>
              <p className="text-gray-600 text-center">Analisis gerakan real-time dengan teknologi AI canggih untuk menyempurnakan teknik dan postur Anda.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-600 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-center mb-4">Kursus Lengkap</h3>
              <p className="text-gray-600 text-center">Akses berbagai kursus bela diri dari pemula hingga tingkat lanjut dengan kurikulum terstruktur.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Training Programs */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Program Latihan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Pilih dari berbagai program latihan bela diri yang dirancang oleh para ahli</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Program Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="h-56 relative">
                <Image 
                  src="/images/karate.jpg" 
                  alt="Karate" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Populer</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Karate</h3>
                <p className="text-gray-600 mb-6">Pelajari teknik dasar dan lanjutan karate dengan instruktur berpengalaman dari berbagai aliran.</p>
                <Link href="/program/karate" className="text-red-600 font-semibold hover:text-red-700 transition-all flex items-center">
                  Lihat Program 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Program Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="h-56 relative">
                <Image 
                  src="/images/taekwondo.jpg" 
                  alt="Taekwondo" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Baru</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Taekwondo</h3>
                <p className="text-gray-600 mb-6">Kuasai seni bela diri Korea dengan fokus pada tendangan dan kecepatan untuk pertahanan diri.</p>
                <Link href="/program/taekwondo" className="text-red-600 font-semibold hover:text-red-700 transition-all flex items-center">
                  Lihat Program 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Program Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="h-56 relative">
                <Image 
                  src="/images/silat.jpg" 
                  alt="Pencak Silat" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Tradisional</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Pencak Silat</h3>
                <p className="text-gray-600 mb-6">Pelajari seni bela diri tradisional Indonesia dengan gerakan yang dinamis dan efektif.</p>
                <Link href="/program/silat" className="text-red-600 font-semibold hover:text-red-700 transition-all flex items-center">
                  Lihat Program 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Siap Untuk Memulai Perjalanan Bela Dirimu?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">Bergabunglah dengan ribuan praktisi bela diri lainnya dan tingkatkan kemampuanmu sekarang dengan bantuan teknologi AI!</p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg transition-all duration-300 inline-block shadow-lg transform hover:-translate-y-1">
              Daftar Sekarang
            </Link>
            <Link href="/demo" className="border-2 border-white hover:bg-white hover:text-red-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 inline-block shadow-lg transform hover:-translate-y-1">
              Coba Demo
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-6">CombatIn</h3>
              <p className="text-gray-400 mb-6">Platform belajar bela diri online terbaik di Indonesia dengan teknologi AI.</p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Program</h4>
              <ul className="space-y-3">
                <li><Link href="/program/karate" className="text-gray-400 hover:text-white transition-all">Karate</Link></li>
                <li><Link href="/program/taekwondo" className="text-gray-400 hover:text-white transition-all">Taekwondo</Link></li>
                <li><Link href="/program/silat" className="text-gray-400 hover:text-white transition-all">Pencak Silat</Link></li>
                <li><Link href="/program/boxing" className="text-gray-400 hover:text-white transition-all">Boxing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Tentang Kami</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-all">Tentang</Link></li>
                <li><Link href="/instructors" className="text-gray-400 hover:text-white transition-all">Instruktur</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-all">FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-all">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Hubungi Kami</h4>
              <p className="text-gray-400 mb-3">Email: info@combatin.id</p>
              <p className="text-gray-400 mb-6">Telepon: +62 123 4567 890</p>
              <form className="flex">
                <input type="email" placeholder="Email Anda" className="px-4 py-2 rounded-l-lg w-full focus:outline-none" />
                <button className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors">Langganan</button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2023 CombatIn. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
