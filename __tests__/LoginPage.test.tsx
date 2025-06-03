import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '../pages/auth/login'
import * as nextRouter from 'next/router' 

global.fetch = jest.fn()

describe('LoginPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest
      .spyOn(nextRouter, 'useRouter')
      .mockReturnValue({ push: mockPush } as any)
    ;(fetch as jest.Mock).mockReset()
    mockPush.mockReset()
  })

  it('vykreslí titul Přihlášení', () => {
    render(<LoginPage />)
    expect(screen.getByText('Přihlášení')).toBeInTheDocument()
  })

  it('při úspěšném loginu volá router.push', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'OK' }),
    })

    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'admin@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Heslo/), {
      target: { value: 'secret123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Přihlásit se/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({ method: 'POST' })
      )
      expect(mockPush).toHaveBeenCalledWith('/admin/references')
    })
  })
})
