import { MainLayout } from "@/components/layout/main-layout"

export default function HomePage() {
  return (
    <MainLayout>
      {/* Placeholder Content Area */}
      <section className="border-t border-[#EAECF1] bg-[#F7F8FB] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <div className="rounded-xl border-2 border-dashed border-[#D2D7DF] bg-white p-12">
            <p className="text-lg text-[#5A6881]">Content placeholder — Replace this area with your custom content</p>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
