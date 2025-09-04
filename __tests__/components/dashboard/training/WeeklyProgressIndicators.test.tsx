import { render, screen } from '@testing-library/react'
import { WeeklyProgressIndicators } from '@/components/dashboard/training/WeeklyProgressIndicators'
import type { WeeklyWorkoutSchedule } from '@/lib/training'

// Mock data similar to what would come from the API
const mockWorkouts: WeeklyWorkoutSchedule['workouts'] = [
  {
    day_of_week: 'segunda-feira',
    completed_today: true,
    workout_template: {
      id: '1',
      name: 'Treino A - Peito e Tríceps',
      description: 'Foco em músculos peitorais e tríceps',
      estimated_duration_minutes: 60
    },
    total_exercises: 6,
    total_sets: 18
  },
  {
    day_of_week: 'quarta-feira',
    completed_today: false,
    workout_template: {
      id: '2', 
      name: 'Treino B - Costas e Bíceps',
      description: 'Foco em músculos das costas e bíceps',
      estimated_duration_minutes: 55
    },
    total_exercises: 5,
    total_sets: 15
  },
  {
    day_of_week: 'sexta-feira',
    completed_today: false,
    workout_template: {
      id: '3',
      name: 'Treino C - Pernas',
      description: 'Treino completo de pernas',
      estimated_duration_minutes: 70
    },
    total_exercises: 7,
    total_sets: 21
  }
]

describe('WeeklyProgressIndicators', () => {
  it('should render all 7 days of the week', () => {
    render(<WeeklyProgressIndicators workouts={mockWorkouts} />)
    
    // Should show abbreviations for all days
    expect(screen.getByText('S')).toBeInTheDocument() // Segunda
    expect(screen.getByText('T')).toBeInTheDocument() // Terça  
    expect(screen.getByText('Q')).toBeInTheDocument() // Quarta
    expect(screen.getByText('Q')).toBeInTheDocument() // Quinta
    expect(screen.getByText('S')).toBeInTheDocument() // Sexta
    expect(screen.getByText('S')).toBeInTheDocument() // Sábado
    expect(screen.getByText('D')).toBeInTheDocument() // Domingo
  })

  it('should show completed workout as filled indicator', () => {
    render(<WeeklyProgressIndicators workouts={mockWorkouts} />)
    
    // Monday workout is completed, should have emerald styling
    const container = screen.getByTitle('segunda-feira - Realizado')
    expect(container).toBeInTheDocument()
  })

  it('should show pending workouts as empty indicators', () => {
    render(<WeeklyProgressIndicators workouts={mockWorkouts} />)
    
    // Wednesday and Friday workouts are pending
    expect(screen.getByTitle('quarta-feira - Pendente')).toBeInTheDocument()
    expect(screen.getByTitle('sexta-feira - Pendente')).toBeInTheDocument()
  })

  it('should show days without workouts', () => {
    render(<WeeklyProgressIndicators workouts={mockWorkouts} />)
    
    // Tuesday, Thursday, Saturday, Sunday should show "Sem treino"
    expect(screen.getByTitle('terça-feira - Sem treino')).toBeInTheDocument()
    expect(screen.getByTitle('quinta-feira - Sem treino')).toBeInTheDocument()
    expect(screen.getByTitle('sábado - Sem treino')).toBeInTheDocument()
    expect(screen.getByTitle('domingo - Sem treino')).toBeInTheDocument()
  })
})
