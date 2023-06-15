import Head from "next/head";
import Footer from "@/components/Footer";
import StorybookGenerator from "@/components/StorybookGenerator"

export default function Home() {

  return (
    <>
      <Head>

        <title>Storybook Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="description"
          content="Generate a storybook with AI."
        />
        <meta
          property="og:site_name"
          content="linkedin-booster.vercel.app"
        />
        <meta
          property="og:description"
          content="Enter a sentence/topic and page number and use AI to create a storybook."
        />
        <meta
          property="og:title"
          content="Storybook Generator with AI"
        />
      </Head>

      <main>
        <nav className="bg-blue-900 text-white ">
          <div className="px-5">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center h-16 ">
                <div className="flex items-center text-base ">
                  <a target="_blank"
                    href="https://www.linkedin.com/in/daniel-m-peterson/"
                    rel="noreferrer"
                    className="text-white flex max-w-fit items-center justify-center space-x-2 text-xl"
                  >
                    <p>👨‍🌾</p>

                  </a>
                  <a target="_blank"
                    href="#"
                    rel="noreferrer"
                    className="text-white flex max-w-fit items-center justify-center space-x-2 text-xl"
                  >
                    <p>👨‍🏭</p>

                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <section className="py-10 lg:py-20 ">
          <div className="px-4">
            <div className="max-w-5xl mx-auto">
              <div className="w-full mx-auto">
                <h1 className="text-6xl text-center font-bold pb-1 text-slate-900">
                  Storybook Generator  🔮
                </h1>
                <p className="mt-3 mb-10 text-center">
                  Generate a storybook with AI. <br />
                </p>
                <div className="flex flex-col md:flex-row w-full md:space-x-20">
                  <StorybookGenerator />
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto">
          <Footer />
        </div>
      </main>
    </>
  );
}
