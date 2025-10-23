import Navbar2 from "../components/Navbar2";

const Home = () => {
  return (
    <div>
      <Navbar2 />
    <div className="font-display bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark min-h-screen flex flex-col">

      {/* Main Section */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-blue-600 text-5xl md:text-4xl font-bold tracking-tight">
            Join Our Professional Network
          </h2>
          <p className="mt-4 text-lg text-subtle-light dark:text-subtle-dark">
            Connect with top talent or find your next career opportunity. Choose
            your path below.
          </p>
        </div>

        {/* Cards Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 @container">
          {/* Job Seeker Card */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg overflow-hidden flex flex-col group">
            <div className="relative">
              <div
                className="w-full h-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWCATZI_2RvNDMHPaCuFgrcQLWvEPAiMI_I5_tZIP7mo6bT3YZFV3dkcEyrTZTF5JwsoGdkSB_9GAG6ULZ9RcTTtWTPbEfHUWbkJvFisadLDR1N-QaKYGraPsyoy27fgbhNZ2-Yg0XCnvzhofxXKRJt8-7q_2EE8WcrI8yC6Z1bZKZhhcGTLcZw54TqgbyeVGtzUh-k2QMUmqb-6oit644JHO8bvJzvV72ApUAZIvaL06Zl2fT5upXid-Mhzwz0BKRhH4ML8cUXFU")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">For Job Seekers</h3>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <p className="text-medium text-subtle-light dark:text-subtle-dark">
                Find jobs, build your professional brand, and get hired.
              </p>
              <ul className="mt-4 space-y-3 text-medium flex-grow">
                <li className="flex items-start">
                  <span className="h-5 w-5 text-medium mr-2.5">🔍</span>
                  <span>Advanced job search.</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 text-medium mr-2.5">👤</span>
                  <span>Create a professional profile.</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 text-medium mr-2.5">📄</span>
                  <span>Easily upload your resume.</span>
                </li>
              </ul>
              <div className="mt-6 space-y-3">
                <a
                  href="/user/signup"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 px-4 text-xl hover:bg-primary/90 transition-colors duration-300"
                >
                  Sign Up as Job Seeker
                </a>
                <a
                  href="/user/login"
                  className="block w-full text-center text-medium text-primary hover:underline"
                >
                  Already have an account? Sign In
                </a>
              </div>
            </div>
          </div>

          {/* Recruiter Card */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg overflow-hidden flex flex-col group">
            <div className="relative">
              <div
                className="w-full h-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwZqG5n1MNR60UrgR_gb_COmdod-R2_wjJsXhVnV3Gv_4fIlcoijjCAq47q7f1DxrjYq1VgcVeO9FmK0_B_a-HdSsZQIRcILTobAL19XB6TOfjxsYVscENOt_r-wMPpnVz4ZizXwthsDX-bwmx0KL7CPW2PLJmPwkI-eO4R6PAELoyVZ0b80Mo_1jztYxkItK5D2KJLUhT2l3sSbRPZiLWUSFZaNAtCe_KefACmA2JRhZ4E5qhIZM6gymUV1Ac4PmIZfpWCylz2fY")',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">For Recruiters</h3>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <p className="text-medium text-subtle-light dark:text-subtle-dark">
                Post jobs, search our candidate database, and manage applications.
              </p>
              <ul className="mt-4 space-y-3 text-medium flex-grow">
                <li>📢 Post job openings.</li>
                <li>🔍 Search candidate profiles.</li>
                <li>📋 Manage your hiring pipeline.</li>
              </ul>
              <div className="mt-6 space-y-3">
                <a
                  href="/recruiter/signup"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 px-4 text-xl hover:bg-primary/90 transition-colors duration-300"
                >
                  Sign Up as Recruiter
                </a>
                <a
                  href="/recruiter/login"
                  className="block w-full text-center text-medium text-primary hover:underline"
                >
                  Already have an account? Sign In
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a href="/" className="text-medium font-medium text-primary hover:underline">
            Back to Home
          </a>
        </div>
      </main>
    </div>
    </div>
  );
};

export default Home;
