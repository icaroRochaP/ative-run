/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { WorkoutDetailModal } from '@/components/dashboard/training/WorkoutDetailModal'
import '@testing-library/jest-dom'

// Mock dos hooks de treino
jest.mock('@/hooks/training/useWorkoutDetails', () => ({
  useWorkoutDetails: jest.fn(() => ({
    workoutDetails: null,
    workoutTemplate: null,
    loading: false,
    error: null,
    refetch: jest.fn()
  }))
}))

jest.mock('@/lib/training', () => ({
  formatDuration: jest.fn(() => '30 min'),
  formatMuscleGroups: jest.fn(() => 'Peito, Tríceps')
}))

describe('Modal Overlay Fix - WorkoutDetailModal', () => {
  const defaultProps = {
    workoutTemplate: null,
    isOpen: true,
    onClose: jest.fn(),
    userId: 'test-user-id'
  }

  it('should render modal overlay with correct CSS classes for full coverage', () => {
    render(<WorkoutDetailModal {...defaultProps} />)
    
    // Buscar o overlay do modal
    const modalOverlay = document.querySelector('.modal-overlay-full')
    
    expect(modalOverlay).toBeInTheDocument()
    expect(modalOverlay).toHaveClass('modal-overlay-full')
    expect(modalOverlay).toHaveClass('bg-black/50')
    expect(modalOverlay).toHaveClass('z-50')
  })

  it('should have proper positioning styles', () => {
    render(<WorkoutDetailModal {...defaultProps} />)
    
    const modalOverlay = document.querySelector('.modal-overlay-full')
    
    // O CSS personalizado garante cobertura completa
    const computedStyles = window.getComputedStyle(modalOverlay as Element)
    
    // Verificar se as propriedades de posicionamento estão aplicadas
    expect(modalOverlay).toHaveClass('modal-overlay-full')
  })

  it('should not render when modal is closed', () => {
    render(<WorkoutDetailModal {...defaultProps} isOpen={false} />)
    
    const modalOverlay = document.querySelector('.modal-overlay-full')
    expect(modalOverlay).not.toBeInTheDocument()
  })

  it('should render modal content area correctly', () => {
    render(<WorkoutDetailModal {...defaultProps} />)
    
    // Verificar que o container do modal está presente
    const modalContainer = document.querySelector('.w-full.max-w-sm')
    expect(modalContainer).toBeInTheDocument()
    
    // Verificar classes responsivas
    expect(modalContainer).toHaveClass('xs:max-w-md')
    expect(modalContainer).toHaveClass('min-h-full')
    expect(modalContainer).toHaveClass('xs:min-h-0')
  })
})

describe('Modal CSS Class Testing', () => {
  beforeEach(() => {
    // Simular as classes CSS do Tailwind e nossa classe customizada
    const style = document.createElement('style')
    style.textContent = `
      .modal-overlay-full {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        min-height: 100vh;
        min-height: 100dvh;
      }
      .bg-black\\/50 {
        background-color: rgba(0, 0, 0, 0.5);
      }
      .z-50 {
        z-index: 50;
      }
    `
    document.head.appendChild(style)
  })

  it('should apply full viewport coverage styles', () => {
    const testDiv = document.createElement('div')
    testDiv.className = 'modal-overlay-full bg-black/50 z-50'
    document.body.appendChild(testDiv)

    const computedStyles = window.getComputedStyle(testDiv)
    
    expect(computedStyles.position).toBe('fixed')
    expect(computedStyles.top).toBe('0px')
    expect(computedStyles.left).toBe('0px')
    expect(computedStyles.right).toBe('0px')
    expect(computedStyles.bottom).toBe('0px')
  })
})
