import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const teamMembers = [
  {
    name: 'Chetan Kumar',
    role: 'Full Stack Developer',
    description:
      'Leads end-to-end feature delivery across frontend and backend modules with a strong focus on product flow.',
  },
  {
    name: 'Vikranth Subramanyam',
    role: 'Backend and API Engineer',
    description:
      'Designs scalable APIs, data models, and secure workflow logic for NGO and delivery partner coordination.',
  },
  {
    name: 'Vikas P',
    role: 'Frontend and Mapping Engineer',
    description:
      'Builds user-friendly interfaces, geolocation features, and dashboards that make food donation tracking easy.',
  },
];

const technologies = ['React', 'Node.js', 'Express', 'MongoDB', 'Leaflet', 'Chart.js'];

const projectSteps = [
  {
    title: 'Donate',
    description: 'Food donors share meal details, quantity, and pickup location in a few simple steps.',
    emoji: '🍱',
  },
  {
    title: 'Coordinate',
    description: 'NGO partners claim donations, verify freshness, and manage distribution planning.',
    emoji: '🤝',
  },
  {
    title: 'Deliver',
    description: 'Delivery partners pick up food and move it safely to NGO distribution points.',
    emoji: '🚚',
  },
  {
    title: 'Serve',
    description: 'Meals are distributed to people in need with visibility and accountability.',
    emoji: '❤️',
  },
];

const techStyles = {
  React: 'from-cyan-100 to-cyan-50 text-cyan-700 border-cyan-200',
  'Node.js': 'from-lime-100 to-lime-50 text-lime-700 border-lime-200',
  Express: 'from-slate-100 to-slate-50 text-slate-700 border-slate-200',
  MongoDB: 'from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200',
  Leaflet: 'from-green-100 to-green-50 text-green-700 border-green-200',
  'Chart.js': 'from-orange-100 to-orange-50 text-orange-700 border-orange-200',
};

export default function AboutProject() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-white to-slate-50/70">
      <Navbar />

      <section className="mx-auto w-full max-w-6xl px-4 pt-10 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 p-6 text-white shadow-lg md:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-lime-200/30 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-50">About The Project</p>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">Waste Food Redistribution System</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-emerald-50 md:text-lg">
              This platform reduces food waste by connecting donors, NGO partners, and delivery volunteers in one
              unified flow. From donation pickup to final distribution, the system helps food reach people in need
              quickly, transparently, and safely.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Team Members</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Core Team
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="mb-4 h-1.5 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 transition-all duration-300 group-hover:w-20" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{member.name}</h3>
                <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{member.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Project Guide</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">
            Donors submit food details, NGOs claim and coordinate collection, delivery partners transport food, and NGOs
            distribute meals to beneficiaries. The platform adds visibility through status updates, analytics, and maps
            to keep the full process efficient and accountable.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {projectSteps.map((step) => (
              <div key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 text-2xl" aria-hidden="true">{step.emoji}</div>
                <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Technologies Used</h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {technologies.map((tech) => (
              <li key={tech}>
                <div
                  className={`rounded-xl border bg-gradient-to-br px-4 py-3 text-sm font-semibold md:text-base ${techStyles[tech] || 'from-slate-100 to-slate-50 text-slate-700 border-slate-200'}`}
                >
                  {tech}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
