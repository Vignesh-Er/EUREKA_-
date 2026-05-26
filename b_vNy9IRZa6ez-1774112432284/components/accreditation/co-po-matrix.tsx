"use client"

export function CoPoMatrix() {
  const POs = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12']
  const COs = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5']
  
  // High: 3, Medium: 2, Low: 1, None: ''
  const mockData = [
    [3, 2, 1, '', '', 1, '', '', '', '', '', 2],
    [2, 3, 2, 1, '', '', '', '', '', '', '', 1],
    [1, 2, 3, 2, '', '', '', '', '', '', '', ''],
    ['', 1, 2, 3, '', '', '', '', 2, '', '', ''],
    [2, '', 1, 2, 3, '', '', '', '', 1, '', ''],
  ]

  const getColor = (val: string | number) => {
    if (val === 3) return 'bg-primary/80 text-primary-foreground font-bold'
    if (val === 2) return 'bg-primary/40 text-foreground font-medium'
    if (val === 1) return 'bg-primary/10 text-muted-foreground'
    return 'bg-transparent text-transparent'
  }

  return (
    <div className="overflow-x-auto pb-4">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="p-2 border-b-2 border-r-2 border-sidebar-border text-left w-16"></th>
            {POs.map(po => (
              <th key={po} className="p-2 border-b-2 border-sidebar-border text-center text-xs font-semibold text-muted-foreground w-10">
                {po}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COs.map((co, i) => (
            <tr key={co} className="hover:bg-sidebar-accent/50 transition-colors">
              <th className="p-2 border-r-2 border-b border-sidebar-border text-xs font-semibold text-foreground">
                {co}
              </th>
              {mockData[i].map((val, j) => (
                <td key={j} className="p-1 border-b border-sidebar-border text-center">
                  <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-md text-xs transition-colors hover:ring-2 ring-primary/50 cursor-pointer ${getColor(val)}`}>
                    {val}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-6 mt-6 justify-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/80"></div> 3 - High
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/40"></div> 2 - Medium
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/10"></div> 1 - Low
        </div>
      </div>
    </div>
  )
}
