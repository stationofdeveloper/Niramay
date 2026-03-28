// import { Clock, RefreshCw } from 'lucide-react'
// import { TIME_SLOTS } from '../lib/constants'
// import { cn } from '../lib/utils'

// // status: 'available' | 'booked' | 'loading' | 'unknown'

// export default function SlotPicker({
//   slotStatuses = {},   // { '9:00 AM': 'available', '10:00 AM': 'booked', ... }
//   selected,
//   onSelect,
//   disabled = false,
// }) {
//   const allLoading = TIME_SLOTS.every(
//     (s) => !slotStatuses[s] || slotStatuses[s] === 'loading'
//   )

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-3">
//         <p className="text-sm font-medium text-forest-700 flex items-center gap-1.5">
//           <Clock className="w-4 h-4" />
//           Available Time Slots
//         </p>
//         {allLoading && (
//           <span className="flex items-center gap-1 text-xs text-gray-400">
//             <RefreshCw className="w-3 h-3 animate-spin" />
//             Checking...
//           </span>
//         )}
//       </div>

//       <div className="grid grid-cols-3 gap-2.5">
//         {TIME_SLOTS.map((slot) => {
//           const status   = slotStatuses[slot] || 'loading'
//           const isSelected  = selected === slot
//           const isAvailable = status === 'available'
//           const isBooked    = status === 'booked'
//           const isLoading   = status === 'loading'

//           return (
//             <button
//               key={slot}
//               type="button"
//               disabled={!isAvailable || disabled}
//               onClick={() => isAvailable && onSelect(slot)}
//               className={cn(
//                 'relative py-3 px-2 rounded-xl text-sm font-medium transition-all border',

//                 // Loading skeleton
//                 isLoading &&
//                   'shimmer border-cream-200 text-transparent cursor-wait select-none',

//                 // Booked
//                 isBooked &&
//                   'bg-red-50 border-red-100 text-red-300 cursor-not-allowed line-through',

//                 // Selected
//                 isSelected &&
//                   'bg-forest-600 border-forest-600 text-white shadow-md scale-105',

//                 // Available (not selected)
//                 isAvailable && !isSelected &&
//                   'bg-white border-forest-200 text-forest-700 hover:border-forest-400 hover:bg-forest-50 cursor-pointer hover:scale-105',
//               )}
//             >
//               {/* Slot label — hidden during loading so shimmer shows */}
//               <span className={isLoading ? 'invisible' : ''}>{slot}</span>

//               {/* Dot indicators */}
//               {isBooked && (
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-300 rounded-full" />
//               )}
//               {isSelected && (
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-gold-400 rounded-full" />
//               )}
//             </button>
//           )
//         })}
//       </div>

//       {/* Legend */}
//       <div className="flex items-center gap-5 mt-4 text-xs text-gray-400">
//         <span className="flex items-center gap-1.5">
//           <span className="w-3 h-3 rounded-sm bg-forest-600 inline-block" />
//           Selected
//         </span>
//         <span className="flex items-center gap-1.5">
//           <span className="w-3 h-3 rounded-sm bg-white border border-forest-200 inline-block" />
//           Available
//         </span>
//         <span className="flex items-center gap-1.5">
//           <span className="w-3 h-3 rounded-sm bg-red-50 border border-red-100 inline-block" />
//           Booked
//         </span>
//       </div>
//     </div>
//   )
// }




















import { Clock, RefreshCw, AlertCircle } from 'lucide-react'
import { TIME_SLOTS } from '../lib/constants'
import { cn } from '../lib/utils'

export default function SlotPicker({
  slotStatuses = {},
  selected,
  onSelect,
  disabled = false,
}) {
  const allLoading = TIME_SLOTS.every(
    (s) => !slotStatuses[s] || slotStatuses[s] === 'loading'
  )

  const availableCount = TIME_SLOTS.filter(
    (s) => slotStatuses[s] === 'available'
  ).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-forest-700 flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          Available Time Slots
        </p>
        {allLoading ? (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Checking...
          </span>
        ) : (
          <span className="text-xs text-forest-600 font-medium">
            {availableCount} slot{availableCount !== 1 ? 's' : ''} available
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {TIME_SLOTS.map((slot) => {
          const status      = slotStatuses[slot] || 'loading'
          const isSelected  = selected === slot
          const isAvailable = status === 'available'
          const isBooked    = status === 'booked'
          const isLoading   = status === 'loading'
          const isPast      = status === 'past'

          return (
            <button
              key={slot}
              type="button"
              disabled={!isAvailable || disabled}
              onClick={() => isAvailable && onSelect(slot)}
              title={
                isPast   ? 'This time has already passed' :
                isBooked ? 'This slot is already booked'  : ''
              }
              className={cn(
                'relative py-3 px-2 rounded-xl text-sm font-medium transition-all border',
                isLoading   && 'shimmer border-cream-200 text-transparent cursor-wait select-none',
                isPast      && 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed',
                isBooked    && 'bg-red-50 border-red-100 text-red-300 cursor-not-allowed line-through',
                isSelected  && 'bg-forest-600 border-forest-600 text-white shadow-md scale-105',
                isAvailable && !isSelected &&
                  'bg-white border-forest-200 text-forest-700 hover:border-forest-400 hover:bg-forest-50 cursor-pointer hover:scale-105',
              )}
            >
              <span className={isLoading ? 'invisible' : ''}>{slot}</span>

              {isBooked && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-300 rounded-full" />
              )}
              {isPast && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-gray-300 rounded-full" />
              )}
              {isSelected && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold-400 rounded-full" />
              )}
              {isPast && (
                <span className="absolute bottom-0.5 left-0 right-0 text-center text-[9px] text-gray-300">
                  past
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-forest-600 inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-white border border-forest-200 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-50 border border-red-100 inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200 inline-block" />
          Past
        </span>
      </div>

      {!allLoading && availableCount === 0 && (
        <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            No slots available for this date. Please choose another date.
          </p>
        </div>
      )}
    </div>
  )
}