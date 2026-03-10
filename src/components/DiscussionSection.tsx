import { useState } from "react";

interface DiscussionItem {
  headline: string;
  arg: string;
  response: string;
}

const ITEMS: DiscussionItem[] = [
  {
    headline: '"I don\'t want to transfer and wait in the rain every morning"',
    arg: "Splitting routes forces through-passengers to transfer. Transfers add waiting time, walking between stops, and uncertainty. For people with mobility issues, children, or luggage, a transfer is a much bigger barrier than a few minutes of delay.",
    response: "A well-functioning network cannot be designed around everyone having a direct route to their specific destination. That approach is what created the old tangled network in the first place. Reliable short routes with good interchanges serve more people better than unreliable long routes that theoretically go everywhere. The 90-minute fare already removes the financial penalty. If interchange points are well-designed with sheltered waiting and real-time information, the transfer experience becomes quick and predictable.",
  },
  {
    headline: '"The bus comes every 6 minutes, so who cares if it\'s late?"',
    arg: "On high-frequency routes, being 5 minutes late matters less because another bus is right behind. BusConnects spines run at much higher frequencies than the old network, so the passenger experience of delays may be less severe than the punctuality numbers suggest.",
    response: "The data shows that many of the longest routes are not actually high-frequency. And running long routes frequently is inherently more expensive, requiring more vehicles to maintain headways across a greater distance. The same budget spent on shorter routes could deliver both better frequency and better reliability. You get more buses running on time rather than more buses running late.",
  },
  {
    headline: '"The bus lanes aren\'t built yet, give it time"',
    arg: "BusConnects was designed as a package: new routes plus new bus lanes. The Core Bus Corridors with dedicated lanes are supposed to solve the congestion problem. Judging route design without the infrastructure is premature.",
    response: "A transport network needs to work with current constraints, not future promises. The Core Bus Corridors are years behind schedule and passengers are dealing with the consequences now. Designing routes that depend on infrastructure that does not exist puts the cost of that delay on riders every single day. Shorter routes would work acceptably today and perform even better once the corridors arrive.",
  },
  {
    headline: '"It\'s the traffic, not the route length"',
    arg: "Long routes pass through Dublin's congested city centre. It may be the congestion causing poor punctuality rather than the route length itself. With dedicated bus lanes, long routes might perform fine.",
    response: "The express route evidence challenges this directly. Routes covering the same distances through similar areas but skipping most stops perform well. Congestion is real, but it is the stops that turn congestion into compounding delay. A bus stuck in traffic loses a few minutes once. A bus stuck in traffic that then has to make 15 more stops loses those minutes again and again. Each stop resets the delay clock.",
  },
  {
    headline: '"My grandmother can\'t walk 500m to a bus stop"',
    arg: "Wider stop spacing means longer walks, which disproportionately affects elderly, disabled, and mobility-impaired passengers. The tight spacing may be a deliberate accessibility choice.",
    response: "Accessibility is crucial, but degrading the entire network is not the answer. Individual mobility needs are better addressed through targeted solutions: demand-responsive services, community transport, accessible shuttle connections to the main network. A bus network shaped around the walking radius of its most limited users comes at a cost to every other passenger, and ultimately delivers a worse service to everyone, including those same vulnerable users who then face unreliable long routes that are always late.",
  },
];

export default function DiscussionSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="bg-slate-900 rounded-2xl p-7 border border-slate-800 mt-5">
      <h3 className="mt-0 mb-1.5 text-xl font-extrabold text-slate-50">Discussion</h3>
      <p className="mt-0 mb-4 text-sm text-slate-500">Click any argument to expand the response.</p>

      {ITEMS.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            onClick={() => setOpenIdx(isOpen ? null : i)}
            className={`mb-3 bg-slate-800 rounded-xl overflow-hidden border transition-colors duration-200 cursor-pointer ${isOpen ? "border-slate-700" : "border-slate-800"}`}
          >
            <div className="py-4 px-4.5 select-none">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="text-base font-bold text-slate-100 leading-snug mb-1.5">{item.headline}</div>
                  <div className="text-sm text-slate-400 leading-relaxed">{item.arg}</div>
                </div>
                <div
                  className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center mt-0.5 transition-all duration-200"
                  style={{ background: isOpen ? "#334155" : "#0f172a" }}
                >
                  <span
                    className="text-sm transition-transform duration-200 block"
                    style={{
                      color: isOpen ? "#e2e8f0" : "#64748b",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >▼</span>
                </div>
              </div>
            </div>
            {isOpen && (
              <div
                className="py-3.5 px-4.5 bg-blue-950 border-l-4 border-l-blue-500"
                style={{ borderTop: "1px solid #1e3a5f" }}
              >
                <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1.5">Response</div>
                <p className="m-0 text-sm text-blue-300 leading-[1.7]">{item.response}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
