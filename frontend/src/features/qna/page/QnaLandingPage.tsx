import Sidebar from '../components/SideBar'
import Header from '../../../shared/ui/Header'
import Footer from '../../../shared/ui/Footer'
import QuestionsList from '../components/QuestionList'

export default function QnaLandigPage() {
  return (
    <div className="dark min-h-screen bg-background relative">
      <div className="fixed inset-0 bg-linear-to-b from-[oklch(0.35_0.15_280)] via-[oklch(0.12_0.04_270)] to-[oklch(0.08_0_0)] pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 30%, oklch(0.35 0.15 280) 0%, oklch(0.15 0.08 275) 15%, oklch(0.08 0 0) 40%, oklch(0.08 0 0) 100%)',
        filter: 'blur(120px)',
        opacity: 0.5,
        zIndex: -1
      }} />
      <Header />
      <div className="flex relative z-0">
        <Sidebar />
        <main className="flex-1">
          <QuestionsList />
        </main>
      </div>
      <Footer />
    </div>
  )
}
