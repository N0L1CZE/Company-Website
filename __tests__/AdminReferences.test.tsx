import { render, screen } from '@testing-library/react'
import AdminReferences from '../pages/admin/references'

const mockData = [
  { id: '1', label: 'Test 1', src: '/img1.jpg', category: 'bytové domy' },
  { id: '2', label: 'Test 2', src: '/img2.jpg', category: 'komerční' },
]

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

describe('AdminReferences', () => {
  it('vykreslí tabulku s počátečními daty', () => {
    render(<AdminReferences initialRefs={mockData} />)
    expect(screen.getByText('Test 1')).toBeInTheDocument()
    expect(screen.getByText('bytové domy')).toBeInTheDocument()
    expect(screen.getByText('Test 2')).toBeInTheDocument()
  })
})
