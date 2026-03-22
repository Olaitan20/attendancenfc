import { Card, CardHead } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { TODAY_SCHEDULE } from '@/lib/mock-data'

export default function ScheduleTimeline() {
  return (
    <Card>
      <CardHead>
        <div>
          <p className="text-[13.5px] font-bold">Today&apos;s Schedule</p>
          <p className="text-[11.5px] text-muted">Friday · {TODAY_SCHEDULE.length} classes</p>
        </div>
        <Badge variant="student">Live</Badge>
      </CardHead>
      <div className="px-5 py-4 flex flex-col gap-0">
        {TODAY_SCHEDULE.map((item, i) => (
          <div
            key={i}
            className={`flex gap-4 py-3.5 border-b border-border1 last:border-0 relative ${
              item.current ? 'bg-student/5 -mx-5 px-5 rounded-lg' : ''
            }`}
          >
            {/* time */}
            <div className="w-14 flex-shrink-0 font-mono text-[11.5px] text-muted pt-0.5">
              {item.time}<br /><span className="text-[10px]">AM</span>
            </div>

            {/* dot + line */}
            <div className="flex flex-col items-center gap-0 flex-shrink-0">
              <div
                className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                style={{
                  background: item.done
                    ? '#10b981'
                    : item.current
                    ? '#06b6d4'
                    : '#2a3348',
                }}
              />
              {i < TODAY_SCHEDULE.length - 1 && (
                <div className="w-px flex-1 min-h-[28px] bg-border1 mt-1" />
              )}
            </div>

            {/* content */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">{item.course}</span>
                {item.current && <Badge variant="student">Now</Badge>}
                {item.done && <Badge variant="ok">Done</Badge>}
              </div>
              <p className="text-[12px] text-muted mt-0.5">
                {item.code} · {item.room} · {item.lecturer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
