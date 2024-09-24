import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react'

export default function Component() {
  const [tasks, setTasks] = useState(['lista', 'compras'])
  const [newTask, setNewTask] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 1)) // September 2024

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()])
      setNewTask('')
    }
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 bg-blue-500 text-white flex justify-between items-center">
          <h1 className="text-3xl font-bold">Agenda</h1>
          <CalendarIcon className="w-8 h-8" />
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="flex mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Agregar tarea"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between bg-blue-100 p-3 rounded-md"
                >
                  <span>{task}</span>
                  <button
                    onClick={() => removeTask(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                  &lt;
                </button>
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 p-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600">
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="text-center p-2"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`text-center p-2 rounded-full hover:bg-blue-100 cursor-pointer ${
                      i + 1 === 23 ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}