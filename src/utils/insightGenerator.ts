import type { Expense, Category, Term } from '../types';

export function generateInsights(term: Term, expenses: Expense[], categories: Category[]): string[] {
    const insights: string[] = [];
    if (expenses.length === 0) {
        return ["Start adding expenses to see smart insights here."];
    }

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const percentUsed = (totalSpent / term.budget) * 100;

    if (percentUsed >= 100) {
        insights.push("🚨 You have exceeded your monthly budget!");
    } else if (percentUsed >= 80) {
        insights.push(`⚠️ Warning: You have used ${percentUsed.toFixed(0)}% of your budget. Consider slowing down your spending.`);
    } else {
        insights.push(`✅ You are on track, having used ${percentUsed.toFixed(0)}% of your monthly budget.`);
    }

    const catSums: Record<string, number> = {};
    expenses.forEach(e => {
        catSums[e.categoryId] = (catSums[e.categoryId] || 0) + e.amount;
    });

    const sortedCats = Object.entries(catSums).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length > 0) {
        const topCatId = sortedCats[0][0];
        const topCatName = categories.find(c => c.id === topCatId)?.name || 'Unknown';
        insights.push(`📊 Most spending was in ${topCatName} ($${sortedCats[0][1].toLocaleString(undefined, { minimumFractionDigits: 2 })}).`);
    }

    const nonCashSum = expenses.filter(e => e.type === 'non-cash').reduce((sum, e) => sum + e.amount, 0);
    const nonCashPercent = (nonCashSum / totalSpent) * 100;

    if (nonCashPercent > 70) {
        insights.push(`💳 High card/digital usage: ${nonCashPercent.toFixed(0)}% of your expenses are non-cash.`);
    } else if (nonCashPercent < 30) {
        insights.push(`💵 Cash heavy: Only ${nonCashPercent.toFixed(0)}% of your expenses are non-cash.`);
    }

    // Rate projection
    const startObj = new Date(term.startDate);
    const endObj = new Date(term.endDate);
    const today = new Date();

    if (today >= startObj && today <= endObj) {
        const totalDays = (endObj.getTime() - startObj.getTime()) / (1000 * 3600 * 24) + 1;
        const daysPassed = (today.getTime() - startObj.getTime()) / (1000 * 3600 * 24) + 1;

        if (daysPassed > 3) {
            const dailyRate = totalSpent / daysPassed;
            const projectedTotal = dailyRate * totalDays;
            if (projectedTotal > term.budget) {
                insights.push(`📈 At your current spending rate ($${dailyRate.toFixed(0)}/day), you may exceed your budget by end of term.`);
            }
        }
    }

    return insights;
}
