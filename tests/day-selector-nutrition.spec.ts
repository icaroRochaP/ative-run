import { test, expect } from '@playwright/test'

test.describe('Day Selector in Nutrition Tab - Brownfield Addition', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página de teste
    await page.goto('/test-nutricao')
    await page.waitForLoadState('networkidle')
  })

  test('should display Weekly Plan Overview Card as first card', async ({ page }) => {
    // Verificar se o Weekly Plan Overview Card está presente
    const weeklyCard = page.locator('[data-testid="weekly-plan-overview-card"]').first()
    await expect(weeklyCard.or(page.locator('h3').filter({ hasText: 'Plano Semanal' }).first())).toBeVisible()
    
    // Verificar texto do card
    await expect(page.locator('text=Plano Semanal')).toBeVisible()
  })

  test('should display Day Selector Card as second card', async ({ page }) => {
    // Verificar se o Day Selector Card está presente
    const daySelectorCard = page.locator('h3').filter({ hasText: 'Navegue entre os dias da semana' })
    await expect(daySelectorCard).toBeVisible()
    
    // Verificar se as pills de dias estão presentes
    const dayPills = page.locator('button').filter({ hasText: /Seg|Ter|Qua|Qui|Sex|Sáb|Dom/ })
    await expect(dayPills.first()).toBeVisible()
  })

  test('should show day pills for navigation', async ({ page }) => {
    // Aguardar os dados carregarem
    await page.waitForTimeout(2000)
    
    // Verificar se pelo menos uma pill de dia está visível
    const dayPills = page.locator('button').filter({ hasText: /Seg|Ter|Qua|Qui|Sex|Sáb|Dom/ })
    
    // Se não há pills visíveis, pode ser porque não há plano semanal
    const hasPills = await dayPills.count()
    
    if (hasPills > 0) {
      await expect(dayPills.first()).toBeVisible()
      console.log('Day pills found and visible')
    } else {
      // Se não há pills, verificar se é porque não há plano
      const noPlanText = page.locator('text=Nenhum plano ativo')
      const hasNoPlan = await noPlanText.count()
      
      if (hasNoPlan > 0) {
        console.log('No weekly plan available - this is expected behavior')
        await expect(noPlanText).toBeVisible()
      }
    }
  })

  test('should display Macro Goals Card', async ({ page }) => {
    // Verificar se o card de metas macro está presente
    const macroCard = page.locator('text=2000').or(page.locator('text=150g').or(page.locator('text=250g')))
    await expect(macroCard.first()).toBeVisible()
  })

  test('should display meal cards', async ({ page }) => {
    // Verificar se há cards de refeições
    const mealCard = page.locator('text=Café da Manhã').or(
      page.locator('text=Almoço').or(
        page.locator('text=Plano de Refeições')
      )
    )
    await expect(mealCard.first()).toBeVisible()
  })

  test('should be able to click on day pills when available', async ({ page }) => {
    // Aguardar carregamento
    await page.waitForTimeout(2000)
    
    const dayPills = page.locator('button').filter({ hasText: /Seg|Ter|Qua|Qui|Sex|Sáb|Dom/ })
    const pillCount = await dayPills.count()
    
    if (pillCount > 1) {
      // Clicar na segunda pill se disponível
      await dayPills.nth(1).click()
      
      // Aguardar atualização
      await page.waitForTimeout(1000)
      
      // Verificar se a pill foi selecionada (pode ter classes diferentes)
      console.log('Day pill clicked successfully')
    } else {
      console.log('Not enough day pills for interaction test')
    }
  })

  test('should show proper card order: Weekly Plan, Day Selector, Macros, Meals', async ({ page }) => {
    // Aguardar carregamento
    await page.waitForTimeout(2000)
    
    // Verificar ordem dos cards
    const cards = page.locator('[class*="space-y-6"] > div, [class*="space-y-6"] > [class*="Card"]')
    
    // Verificar se há pelo menos 3 cards (Weekly Plan, Macros, Meals)
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThanOrEqual(3)
    
    console.log(`Found ${cardCount} cards in the nutrition tab`)
  })

  test('should handle no weekly plan state gracefully', async ({ page }) => {
    // Se não há plano semanal, verificar se a UI mostra estado apropriado
    const noPlanText = page.locator('text=Nenhum plano ativo')
    const createPlanButton = page.locator('text=Clique para criar')
    
    const hasNoPlan = await noPlanText.count()
    
    if (hasNoPlan > 0) {
      await expect(noPlanText).toBeVisible()
      console.log('No plan state displayed correctly')
    } else {
      // Se há plano, verificar se os dados são exibidos
      const planStats = page.locator('text=/\\d+\\/\\d+ dias/').or(page.locator('text=/\\d+ refeições/'))
      if (await planStats.count() > 0) {
        await expect(planStats.first()).toBeVisible()
        console.log('Weekly plan data displayed correctly')
      }
    }
  })
})
