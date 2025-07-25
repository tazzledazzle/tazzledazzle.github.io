---
layout: page
title: "Financial Calculations for Fun and Profit"
---


Financial calculations are essential in personal finance, business, and investment decisions. Here are some common financial calculations:

---

### **1. Interest Calculations**
#### a. **Simple Interest**
$$
\text{Simple Interest (SI)} = P \times r \times t
$$
- $(P): Principal amount$
- $(r): Annual interest rate (decimal)$
- $(t): Time in years$

```java
    // 1. Simple Interest
    public static double calculateSimpleInterest(double principal, 
                                                 double rate, double time) {
        return principal * rate * time;
    }

```
#### b. **Compound Interest**
$$ \text{Compound Interest (CI)} = P \times (1 + \frac{r}{n})^{n \times t} - P
$$
- (P): Principal amount
- (r): Annual interest rate (decimal)
- (n): Number of compounding periods per year
- (t): Time in years

```java
 // 2. Compound Interest
    public static double calculateCompoundInterest(double principal,
                                                   double rate, 
                                                   int compoundsPerYear, 
                                                   double time) {
    
        return principal * Math.pow(1 + (rate / compoundsPerYear),
                                     compoundsPerYear * time) - principal;
    }
```

---

### **2. Loan and Mortgage Payments**
#### a. **Monthly Loan Payment (Amortization)**
$$
M = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}
$$
- \(M\): Monthly payment
- \(P\): Loan principal
- \(r\): Monthly interest rate ($(r = \frac{\text{Annual Rate}}{12})$)
- \(n\): Total number of payments ($(n = \text{Years} \times 12$))

```java
    // 3. Monthly Loan Payment (Amortization)
    public static double calculateMonthlyLoanPayment(double principal,
                                                     double annualRate,
                                                     int years) {
        double monthlyRate = annualRate / 12;
        int totalPayments = years * 12;
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
               (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }

```

#### b. **Total Interest Paid**
$$
\text{Total Interest} = (M \times n) - P
$$
```java

    // 4. Total Interest Paid
    public static double calculateTotalInterest(double monthlyPayment,
                                                int years, double principal) {
        int totalPayments = years * 12;
        return (monthlyPayment * totalPayments) - principal;
    }
```
---

### **3. Investment Growth**
#### a. **Future Value of Investment**
$$
FV = P \times (1 + r)^t
$$
- \(FV\): Future value
- \(P\): Initial investment
- \(r\): Annual rate of return
- \(t\): Number of years
```java
   // 5. Future Value of Investment
    public static double calculateFutureValue(double principal,
                                              double rate, double time) {
        return principal * Math.pow(1 + rate, time);
    }

```
#### b. **Present Value**
$$
PV = \frac{FV}{(1 + r)^t}
$$
- Used to determine the value of future cash flows in today's terms.
```java
    // 6. Present Value
    public static double calculatePresentValue(double futureValue,
                                               double rate, double time) {
        return futureValue / Math.pow(1 + rate, time);
    }
```
---

### **4. Budgeting and Savings**
#### a. **Savings Required for a Goal**
$$
\text{Savings per period} = \frac{\text{Goal Amount}}{n}
$$
- Divide the goal amount by the number of periods until the deadline.
```java
    // 7. Savings Required for a Goal
    public static double calculateSavingsPerPeriod(double goalAmount, int periods) {
        return goalAmount / periods;
    }
```
---

### **5. Retirement Planning**
#### a. **Withdrawal Amount (4% Rule)**
$$
\text{Annual Withdrawal} = 0.04 \times \text{Portfolio Value}
$$
```java
    public static double calculateAnnualWithdrawal(double portfolioValue) {
            return 0.04 * portfolioValue;
    }
```

#### b. **Future Value of Retirement Contributions**
$$
FV = \text{Contribution} \times \frac{(1 + r)^t - 1}{r}
$$
```java
    public static double calculateFutureValueOfContributions(double contribution, 
                                                             double rate,
                                                             double time) {
        return contribution * ((Math.pow(1 + rate, time) - 1) / rate);
    }
```
---

### **6. Business Metrics**
#### a. **Profit Margin**
$$
\text{Profit Margin} = \frac{\text{Net Income}}{\text{Revenue}} \times 100
$$
```java
    public static double calculateProfitMargin(double netIncome, double revenue) {
        return (netIncome / revenue) * 100;
    }
```
#### b. **Break-Even Point**
$$
\text{Break-Even Sales} = \frac{\text{Fixed Costs}}{\text{Selling Price per Unit} - \text{Variable Cost per Unit}}
$$
```java
    public static double calculateBreakEvenSales(double fixedCosts, 
                                                  double sellingPrice, 
                                                  double variableCost) {
        return fixedCosts / (sellingPrice - variableCost);
    }
```
---

### **7. Ratios**
#### a. **Debt-to-Income Ratio**
$$
\text{DTI} = \frac{\text{Total Monthly Debt Payments}}{\text{Gross Monthly Income}} \times 100
$$
```java
    public static double calculateDebtToIncomeRatio(double totalDebtPayments,
                                                    double grossIncome) {
        return (totalDebtPayments / grossIncome) * 100;
    }
```
#### b. **Liquidity Ratio**
$$
\text{Liquidity Ratio} = \frac{\text{Liquid Assets}}{\text{Current Liabilities}}
$$
```java
    public static double calculateLiquidityRatio(double liquidAssets,
                                                 double currentLiabilities) {
        return liquidAssets / currentLiabilities;
    }
```
---

### **8. Stock and Investment Analysis**
#### a. **Return on Investment (ROI)**

$$
\text{ROI} = \frac{\text{Gain from Investment} - \text{Cost of Investment}}{\text{Cost of Investment}} \times 100
$$
```java
    public static double calculateROI(double gain, double cost) {
        return ((gain - cost) / cost) * 100;
    }
```
#### b. **Price-to-Earnings Ratio (P/E)**
$$
\text{P/E Ratio} = \frac{\text{Market Price per Share}}{\text{Earnings per Share}}
$$
```java
    public static double calculatePERatio(double marketPrice, 
                                          double earningsPerShare) {
        return marketPrice / earningsPerShare;
    }
```

---
### Combination of financial calculations
```java
public class FinancialCalculations {

    // 1. Simple Interest
    public static double calculateSimpleInterest(double principal, double rate, double time) {
        return principal * rate * time;
    }

    // 2. Compound Interest
    public static double calculateCompoundInterest(double principal, double rate, int compoundsPerYear, double time) {
        return principal * Math.pow(1 + (rate / compoundsPerYear), compoundsPerYear * time) - principal;
    }

    // 3. Monthly Loan Payment (Amortization)
    public static double calculateMonthlyLoanPayment(double principal, double annualRate, int years) {
        double monthlyRate = annualRate / 12;
        int totalPayments = years * 12;
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
               (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }

    // 4. Total Interest Paid
    public static double calculateTotalInterest(double monthlyPayment, int years, double principal) {
        int totalPayments = years * 12;
        return (monthlyPayment * totalPayments) - principal;
    }

    // 5. Future Value of Investment
    public static double calculateFutureValue(double principal, double rate, double time) {
        return principal * Math.pow(1 + rate, time);
    }

    // 6. Present Value
    public static double calculatePresentValue(double futureValue, double rate, double time) {
        return futureValue / Math.pow(1 + rate, time);
    }

    // 7. Savings Required for a Goal
    public static double calculateSavingsPerPeriod(double goalAmount, int periods) {
        return goalAmount / periods;
    }

    // Main method to demonstrate the calculations
    public static void main(String[] args) {
        // Example usage
        double principal = 10000;
        double annualRate = 0.05; // 5% interest rate
        double time = 5; // 5 years
        int compoundsPerYear = 12;

        // Simple Interest
        System.out.println("Simple Interest: " + calculateSimpleInterest(principal, annualRate, time));

        // Compound Interest
        System.out.println("Compound Interest: " + calculateCompoundInterest(principal, annualRate, compoundsPerYear, time));

        // Monthly Loan Payment
        int loanYears = 10;
        double monthlyPayment = calculateMonthlyLoanPayment(principal, annualRate, loanYears);
        System.out.println("Monthly Loan Payment: " + monthlyPayment);

        // Total Interest Paid
        System.out.println("Total Interest Paid: " + calculateTotalInterest(monthlyPayment, loanYears, principal));

        // Future Value
        System.out.println("Future Value: " + calculateFutureValue(principal, annualRate, time));

        // Present Value
        double futureValue = 20000;
        System.out.println("Present Value: " + calculatePresentValue(futureValue, annualRate, time));

        // Savings Required for a Goal
        double goalAmount = 50000;
        int periods = 10;
        System.out.println("Savings Per Period: " + calculateSavingsPerPeriod(goalAmount, periods));
    }
}
```
