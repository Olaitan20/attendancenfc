interface PageHeaderProps {
  title: string
  sub?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, sub, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
      <div>
        <h2 className="text-xl md:text-[22px] font-extrabold tracking-tight">{title}</h2>
        {sub && <p className="text-[13px] text-muted mt-0.5">{sub}</p>}
      </div>
      {actions && <div className="flex gap-2 items-center flex-wrap">{actions}</div>}
    </div>
  )
}
