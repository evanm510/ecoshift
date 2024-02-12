from flask import Flask, request
from flask_cors import CORS
import datetime

x = datetime.datetime.now()

app = Flask(__name__)
CORS(app)

def calc_ev_cost_per_mile(electricity_price, ev_efficiency):
    return electricity_price / ev_efficiency

def calc_gas_cost_per_mile(gas_price, gas_efficiency):
    return gas_price / gas_efficiency

def calc_equivalent_mpg_cost(gas_price, electricity_price, ev_efficiency):
    return gas_price / (electricity_price / ev_efficiency)

def calc_ev_annual_cost(electricity_price, ev_efficiency, annual_miles):
    return electricity_price / ev_efficiency * annual_miles

def calc_gas_annual_cost(gas_price, gas_efficiency, annual_miles):
    return gas_price / gas_efficiency * annual_miles

def calc_years_until_breakeven(gas_price, gas_efficiency, electricity_price, ev_efficiency, ev_price, gas_vehicle_price, annual_miles, tax_credit):
    price_diff = ev_price - gas_vehicle_price
    if tax_credit:
        price_diff -= 7500

    ev_annual_cost = electricity_price / ev_efficiency * annual_miles
    gas_annual_cost = gas_price / gas_efficiency * annual_miles

    savings_per_year = gas_annual_cost - ev_annual_cost
    if savings_per_year <= 0:
        return float('inf')  # Indicates that breakeven is not achievable

    return price_diff / savings_per_year

@app.route('/calculate', methods=["POST"])
def calculate():
    try:
        data = request.json

        converted_data = {}

        if data["calculationChoices"]["costPerMile"]:
            converted_data["electricityPrice"] = float(data["electricityPrice"])
            converted_data["evEfficiency"] = float(data["evEfficiency"])
        
        if data["calculationChoices"]["equivalentMPG"]:
            converted_data["gasPrice"] = float(data["gasPrice"])
            converted_data["gasEfficiency"] = float(data["gasEfficiency"])

        if data["calculationChoices"]["annualCost"] or data["calculationChoices"]["breakevenTime"]:
            converted_data["annualMiles"] = float(data["annualMileage"])

        if data["calculationChoices"]["breakevenTime"]:
            converted_data["evVehiclePrice"] = float(data["evVehiclePrice"])
            converted_data["gasVehiclePrice"] = float(data["gasVehiclePrice"])
            converted_data["taxCredit"] = data["taxCredit"]


        results = {}


        # Perform calculations
        if data["calculationChoices"]["costPerMile"]:
            ev_cost_per_mile_value = round(calc_ev_cost_per_mile(converted_data["electricityPrice"], converted_data["evEfficiency"]), 2)
            results["cost_per_mile"] = ev_cost_per_mile_value
        if data["calculationChoices"]["annualCost"]:
            annual_cost_ev = round(calc_ev_annual_cost(converted_data["electricityPrice"], converted_data["evEfficiency"], converted_data["annualMiles"]), 2)
            results["annual_cost"] = annual_cost_ev
            if converted_data["gasEfficiency"]:
                annual_cost_gas = round(calc_gas_annual_cost(converted_data["gasPrice"], converted_data["gasEfficiency"], converted_data["annualMiles"]), 2)
                results["annual_cost_gas"] = annual_cost_gas
        if data["calculationChoices"]["equivalentMPG"]:
            equivalent_mpg = round(calc_equivalent_mpg_cost(converted_data["gasPrice"], converted_data["electricityPrice"], converted_data["evEfficiency"]), 2)
            results["equivalent_mpg"] = equivalent_mpg
        if data["calculationChoices"]["breakevenTime"]:
            breakeven_time = round(calc_years_until_breakeven(converted_data["gasPrice"], converted_data["gasEfficiency"], converted_data["electricityPrice"], converted_data["evEfficiency"], converted_data["evVehiclePrice"], converted_data["gasVehiclePrice"], converted_data["annualMiles"], converted_data["taxCredit"]), 2)
            results["breakeven_time"] = breakeven_time

        return results
    
    except Exception as e:
        print(e)
        return {"error": "There was an error processing your request: " + str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
