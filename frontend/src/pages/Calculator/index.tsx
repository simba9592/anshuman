import React, { useState, useEffect } from 'react'
import './style.scss'
import { useSelector, useDispatch } from 'react-redux';
import { apis } from '../../apis'
import { useSnackbar } from "notistack";
import { SET_CURRENT_USER } from '../../redux/actions/types';
import MainButton from '../../components/mainButton';
import Calculator_white from "../../assets/svg/Calculator_white.svg"

export default function Calculator() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user)
  const [countries, setCountries] = useState<CountryData[]>([])
  const [assumptions, setAssumptions] = useState<AssumptionData[]>([])
  const [countryNames, setCountryNames] = useState([])
  const [cCountry, setCCountry] = useState("")
  const [cTop3working, setCTop3working] = useState(0)
  const [cTop3cumulative, setcTop3cumulative] = useState(0)
  const [cBig4working, setCBig4working] = useState(0)
  const [cBig4cumulative, setCBig4cumulative] = useState(0)
  const [cGlobalworking, setCGlobalworking] = useState(0)
  const [cGlobalcumulative, setCGlobalcumulative] = useState(0)
  const [cOtherworking, setCOtherworking] = useState(0)
  const [cOthercumulative, setCOtherculumative] = useState(0)
  const [cLeadingworking, setCLeadingworking] = useState(0)
  const [cLeadingcumulative, setCLeadingcumulative] = useState(0)
  const [cAllworking, setCAllworking] = useState(0)
  const [cAllcumulative, setCAllcumulative] = useState(0)
  const [cExpertise, setCExpertise] = useState(0)
  const [cFeedback, setCFeedback] = useState(0)
  const [rLcu, setRLcu] = useState("")
  const [rMedian, setRMedian] = useState(0)
  const [rMedianLocal, setRMedianLocal] = useState(0)
  const [rTotalexp, setRTotalexp] = useState(0)

  interface CountryData {
    countryName: string;
    lcuAbbreviation: string;
    locationIndex: number | null;
    usdTolcu: number | null;
  }

  interface AssumptionData {
    fieldName: string;
    variable: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      await apis.getCountries()
      .then((res) => {
        if (res.data.length > 0) {
          setCountries(res.data)
          let tempNames = res.data.map((item: any) => item.countryName)
          setCountryNames(tempNames)
        } else {
          enqueueSnackbar({
            variant: "info",
            message: "Admin haven't entered the Countries' data",
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar({
          variant: "error",
          message: error.response.data.msg || error.message,
        });
      })
      await apis.getAssumptions()
      .then((res) => {
        if (res.data.length > 0) {
          setAssumptions(res.data)
        } else {
          enqueueSnackbar({
            variant: "info",
            message: "Admin haven't entered the Model Assumptions' data",
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar({
          variant: "error",
          message: error.response.data.msg || error.message,
        });
      })
    }
    fetchData();
  }, [])

  const inputNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue: any = event.target.value === "" ? 0 : event.target.value.replace(/[^0-9]/g, '');
    if (event.target.id === "cTop3working") setCTop3working(parseFloat(numericValue))
    else if (event.target.id === "cTop3cumulative") setcTop3cumulative(parseFloat(numericValue))
    else if (event.target.id === "cBig4working") setCBig4working(parseFloat(numericValue))
    else if (event.target.id === "cBig4cumulative") setCBig4cumulative(parseFloat(numericValue))
    else if (event.target.id === "cGlobalworking") setCGlobalworking(parseFloat(numericValue))
    else if (event.target.id === "cGlobalcumulative") setCGlobalcumulative(parseFloat(numericValue))
    else if (event.target.id === "cOtherworking") setCOtherworking(parseFloat(numericValue))
    else if (event.target.id === "cOthercumulative") setCOtherculumative(parseFloat(numericValue))
    else if (event.target.id === "cLeadingworking") setCLeadingworking(parseFloat(numericValue))
    else if (event.target.id === "cLeadingcumulative") setCLeadingcumulative(parseFloat(numericValue))
    else if (event.target.id === "cAllworking") setCAllworking(parseFloat(numericValue))
    else if (event.target.id === "cAllcumulative") setCAllcumulative(parseFloat(numericValue))
  }

  const handleSetCountry = (event: any) => {
    setCCountry(event.target.value)
  }

  const handleSetExpertise = (event: any) => {
    setCExpertise(event.target.value)
  }

  const handleSetFeeback = (event: any) => {
    setCFeedback(event.target.value)
  }

  const sumProduct = (first:number[], second:number[]) => {
    if (first.length !== second.length) {
      throw new Error('Array dimensions do not match.');
    }

    const result = first.reduce((accumulator, currentValue, index) => {
      return accumulator + currentValue * second[index];
    }, 0);
  
    return result;
  }

  const sumArray = (array:number[]) => {
    if (array.length === 0) {
      throw new Error('Empty array!');
    }

    return array.reduce((a, b) => a + b, 0);
  }

  const handleCalculate = async () => {
    if (user.permittedNumber > user.currentNumber) {
      if (cCountry === "") {
        enqueueSnackbar({
          variant: "error",
          message: "Please select the Country Name",
        });
        return; 
      }
  
      if (cExpertise === 0) {
        enqueueSnackbar({
          variant: "error",
          message: "Please select the Expertise level of the freelaner",
        });
        return; 
      } 
  
      if (cFeedback === 0) {
        enqueueSnackbar({
          variant: "error",
          message: "Please select the Feedback rating by recent clients/employers",
        });
        return; 
      } 
      let workingArray: number[] = [cTop3working, cBig4working, cOtherworking, cGlobalworking, cLeadingworking, cAllworking]
      let cumulativeArray = [cTop3cumulative, cBig4cumulative, cOthercumulative, cGlobalcumulative, cLeadingcumulative, cAllcumulative]
  
      if (sumArray(workingArray) > sumArray(cumulativeArray)) {
        setRTotalexp(sumArray(workingArray))
      } else {
        setRTotalexp(sumArray(cumulativeArray))
      }
  
      let numberZero = [...workingArray, ...cumulativeArray].filter((item:any) => item === 0).length
      if (numberZero === 12) {
        enqueueSnackbar({
          variant: "error",
          message: "Please enter at least a variable",
        });
        return; 
      }
      let rCountry: any = countries.filter((country) => country.countryName === cCountry)[0]
      setRLcu(rCountry.lcuAbbreviation)
  
      let adminArray = [
        parseFloat(assumptions.filter((item) => item.fieldName === "Weight for top-tier (level 5) experience")[0].variable), 
        parseFloat(assumptions.filter((item) => item.fieldName === "Weight for Big4 (Level 4) experience")[0].variable), 
        parseFloat(assumptions.filter((item) => item.fieldName === "Weight for Level 3 experience")[0].variable), 
        parseFloat(assumptions.filter((item) => item.fieldName === "Weight for Level 4 experience")[0].variable), 
        parseFloat(assumptions.filter((item) => item.fieldName === "Weight for Level 5 experience")[0].variable), 
        parseFloat(assumptions.filter((item) => item.fieldName === "Weight for Level 6 experience")[0].variable)
      ]
      
      let first: any = 0;
      let w6 = parseFloat(assumptions.filter((item) => item.fieldName === "Max premium for top-tier")[0].variable)
      let u9 = parseFloat(rCountry.locationIndex)
      let v6 = parseFloat(assumptions.filter((item) => item.fieldName === "Average undergrad Level 1 salary (USD pa)-base")[0].variable)
      let g6 = parseFloat(assumptions.filter((item) => item.fieldName === "Weight for top-tier (level 5) experience")[0].variable)
      let z6 = parseFloat(assumptions.filter((item) => item.fieldName === "Increment per tier (USD / tier)-base")[0].variable)
      let y6 = parseFloat(assumptions.filter((item) => item.fieldName === "Factor for increment per tier")[0].variable)
  
  
      let expArray: any = []
      let logical = sumProduct(adminArray, workingArray)/sumArray(workingArray)
      let maxArray: any = workingArray.map((value, index) => Math.max(value, cumulativeArray[index]));
      if (logical) {
        first = u9 * v6 * (1 + (w6 - 1) * logical/g6) + (z6 * u9 * y6) * sumProduct(adminArray, maxArray)
      } else {
        expArray = sumProduct(adminArray, maxArray) / sumArray(maxArray)
        first = u9 * v6 * (1 + (w6 - 1) * expArray/g6) + (z6 * u9 * y6) * sumProduct(adminArray, maxArray)
      }
      
      let second: any = 0
      let ac6 = parseFloat(assumptions.filter((item) => item.fieldName === "Expertise premium score-Max")[0].variable)
      let ab6 = parseFloat(assumptions.filter((item) => item.fieldName === "Expertise max premium")[0].variable)
      second = 1 + ( cExpertise / ac6 ) * ab6
  
      let third: any = 0
      let ae6 = parseFloat(assumptions.filter((item) => item.fieldName === "Star factor premium score-Max")[0].variable)
      let ad6 = parseFloat(assumptions.filter((item) => item.fieldName === "Feedback max premium")[0].variable)
      third = 1 + (cFeedback / ae6 ) * ad6
  
      let af6 = parseFloat(assumptions.filter((item) => item.fieldName === "Utilization% compensation")[0].variable)
      let aa6 = parseFloat(assumptions.filter((item) => item.fieldName === "Working days in year")[0].variable)
  
      let total:any = first * second * third * af6 / aa6
      
      setRMedian(Math.floor(total))
      let tempRMedian: number = total * rCountry.usdTolcu
      const formattedNumber: string = tempRMedian.toFixed(2);
      const parsedNumber: number =  Math.floor(parseFloat(formattedNumber))
      setRMedianLocal(parsedNumber)
      await apis.calculateCount({email: user.email})
      .then((res) => {
        user.currentNumber = res.data.currentNumber;
        dispatch({ type: SET_CURRENT_USER, payload: user })
      })
    } else {
      enqueueSnackbar({
        variant: "error",
        message: "You have limited to calculate.",
      });
    }
  }

  return (
    <div className='page'>
      <div className='calculator-container'>
        <div className="title-part">
          <div className='title'>
            <div className="pageTitle">Calculator</div>
            <div>
              <MainButton icon={Calculator_white} title="Calculate" onClick={handleCalculate} />
            </div>
          </div>
          <div className='subTitle'>Freelancer daily rate estimator (Management consulting resource)</div>
          <div className='description'>What should be the median daily rate for a management consultant with a given experience, location, expertise and rating?</div>
        </div>
        <div className='warning-text'>To get the updated outputs, please first update the cells in the input areas. <br />Press the <span>"Calculate" button</span> on the top right of this page to refresh the output whenever inputs are updated</div>
        <div className='output-part'>
          <div className='put-title'>
            <span>Output Area</span>
            <div>Median daily estimator for freelancer</div>
          </div>
          <table className='output-table'>
            <tbody>
              <tr>
                <td className='titleTd'>Median daily rate in USD</td>
                <td className='borderTd'>{rMedian === 0 ? "" : rMedian}</td>
                <td className='borderTd'>USD</td>
                <td className='backgroundTed'>Total work experience of the freelancer in years</td>
              </tr>
              <tr>
                <td className='titleTd'>Median daily rate in local currency</td>
                <td className='borderTd'>{rMedianLocal}</td>
                <td className='borderTd'>{rLcu}</td>
                <td className='borderTd'>{rTotalexp === 0 ? "" : rTotalexp}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='input-part'>
          <div className='put-title'>
            <span>Input Area</span>
            <div>(Please enter inputs relating to freelancer background)</div>
          </div>
          <div className='tableBox'>
            <table className='input-table'>
              <tbody>
                <tr>
                  <td className='noTd'>1</td>
                  <td className='titleTd'>Location</td>
                  <td className='subTitleTd'>Country of residence of the freelancer</td>
                  <td className='borderTd' colSpan={2}>
                    <select className='selectBox hideOption' value={cCountry} onChange={handleSetCountry}>
                      <option value={""}></option>
                      {
                        countryNames.map((name) => {
                          return (
                            <option key={name} value={name}>{name}</option>
                          )
                        })
                      }
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className='noTd' rowSpan={7}>2</td>
                  <td className='titleTd' rowSpan={7}>Work-experience</td>
                  <td>Breakdown of total work-experience of the freelancer <span>(Enter the work-experience in years in the six categories as relevant)</span></td>
                  <td className='borderTd coloredTd'>Working Ex-mix (First 10 years)</td>
                  <td className='borderTd coloredTd'>Cumulative work experience mix</td>
                </tr>
                <tr>
                  <td className='subTitleTd'>i. Top 3 consulting company (e.g. Mckinsey, Bain, BCG, ...)</td>
                  <td className='borderTd'>
                    <input type='text' value={cTop3working} id="cTop3working" onChange={inputNumber} />
                  </td>
                  <td className='borderTd'>
                    <input type='text' value={cTop3cumulative} id="cTop3cumulative" onChange={inputNumber} />
                  </td>
                </tr>
                <tr>
                  <td className='subTitleTd'>ii. Big 4 consulting company (e.g. Deloitte, Accenture, PWC, EY, KPMG, ...)</td>
                  <td className='borderTd'>
                    <input type='text' value={cBig4working} id="cBig4working" onChange={inputNumber} />
                  </td>
                  <td className='borderTd'>
                    <input type='text' value={cBig4cumulative} id="cBig4cumulative" onChange={inputNumber} />
                  </td>
                </tr>
                <tr>
                  <td className='subTitleTd'>iii. Other well known consultancies including boutiques</td>
                  <td className='borderTd'>
                    <input type='text' value={cOtherworking} id="cOtherworking" onChange={inputNumber} />
                  </td>
                  <td className='borderTd'>
                    <input type='text' value={cOthercumulative} id="cOthercumulative" onChange={inputNumber} />
                  </td>
                </tr>
                <tr>
                  <td className='subTitleTd'>iv. Global MNC (any industry)</td>
                  <td className='borderTd'>
                    <input type='text' value={cGlobalworking} id="cGlobalworking" onChange={inputNumber} />
                  </td>
                  <td className='borderTd'>
                    <input type='text' value={cGlobalcumulative} id="cGlobalcumulative" onChange={inputNumber} />
                  </td>
                </tr>
                <tr>
                  <td className='subTitleTd'>v. Leading local company with &gt; 80% revenues from domestic market (any industry)</td>
                  <td className='borderTd'>
                    <input type='text' value={cLeadingworking} id="cLeadingworking" onChange={inputNumber} />
                  </td>
                  <td className='borderTd'>
                    <input type='text' value={cLeadingcumulative} id="cLeadingcumulative" onChange={inputNumber} />
                  </td>
                </tr>
                <tr>
                  <td className='subTitleTd'>vi. All other companies</td>
                  <td className='borderTd'>
                    <input type='text' value={cAllworking} id="cAllworking" onChange={inputNumber} />
                  </td>
                  <td className='borderTd'>
                    <input type='text' value={cAllcumulative} id="cAllcumulative" onChange={inputNumber} />
                  </td>
                </tr>
                <tr>
                <td className='noTd'>3</td>
                  <td className='titleTd'>Depth of Expertise</td>
                  <td className='subTitleTd'>i. Expertise level of the freelancer on a scale of 1 to 5 (1 being 'Generalist, 5 being deep expertise & experience in a specific area)</td>
                  <td className='borderTd' colSpan={2}>
                    <select className='selectBox' value={cExpertise} onChange={handleSetExpertise}>
                      <option value={0}></option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className='noTd'>4</td>
                  <td className='titleTd'>Performance rating</td>
                  <td className='subTitleTd'>i. Feedback rating by recent clients/ employers on a scale of 1 to 3 (1=meets expectations; 2=Exceeds expectations; 3=Simply stellar)</td>
                  <td className='borderTd' colSpan={2}>
                    <select className='selectBox' value={cFeedback} onChange={handleSetFeeback}>
                      <option value={""}></option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  )
}
