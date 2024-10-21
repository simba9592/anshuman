import React, { useState, useEffect } from 'react';
import "./style.scss"
import MainButton from "../../components/mainButton"
import SearchInput from "../../components/searchInput"
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";
import { apis } from '../../apis';

type FileChangeEvent = React.ChangeEvent<HTMLInputElement>;
type ExcelFile = XLSX.WorkBook;

interface OriginalData {
  Country: string;
  "LCU abbreviation": string;
  "Location Index for consulting salaries": string;
  "USD to LCU conversion": string;
}

interface TransformedData {
  countryName: string;
  lcuAbbreviation: string;
  locationIndex: number | null;
  usdTolcu: number | null;
}

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const [originCountries, setOriginCountries] = useState<TransformedData[]>([])
  const [countries, setCountries] = useState<TransformedData[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      await apis.getCountries()
      .then((res) => {
        setCountries(res.data)
        setOriginCountries(res.data)
        if (res.data.length > 0) {
          enqueueSnackbar({
            variant: "success",
            message: "Successfully imported",
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

  const handleImport = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const file = await promptForFile(); // Function to prompt the user to select a file
      const data = await readFile(file);
      const workbook: ExcelFile = XLSX.read(data, { type: 'array' });
      if (workbook.SheetNames.length) {
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: "",
        });
        const originalData: OriginalData[] = rows as OriginalData[];

        const transformedData: TransformedData[] = originalData.map((item: OriginalData) => {
          const {
            Country,
            "LCU abbreviation": LCUAbbreviation,
            "Location Index for consulting salaries": locationIndexStr,
            "USD to LCU conversion": usdTolcuStr,
          } = item;
        
          const locationIndex = parseFloat(locationIndexStr.trim());
          const usdTolcu = parseFloat(usdTolcuStr.trim());
        
          return {
            countryName: Country,
            lcuAbbreviation: LCUAbbreviation,
            locationIndex: isNaN(locationIndex) ? null : locationIndex,
            usdTolcu: isNaN(usdTolcu) ? null : usdTolcu,
          };
        });
        apis.createCountries(transformedData)
        .then((res) => {
          setCountries(res.data.countries);
          setOriginCountries(res.data.countries)
          enqueueSnackbar({
            variant: "success",
            message: res.data?.msg,
          });
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      enqueueSnackbar({
        variant: "error",
        message: "Please import the correct Excel file",
      });
    }
  };

  const promptForFile = () => {
    return new Promise<File>((resolve, reject) => {
      const input: any = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx, .xls';
      input.onchange = (event: FileChangeEvent) => {
        const file = event.target.files?.[0];
        if (file) {
          resolve(file);
        } else {
          reject(new Error('No file selected'));
        }
      };
      input.click();
    });
  };

  const readFile = (file: File) => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        resolve(event.target?.result as ArrayBuffer);
      };
      reader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(event.target?.error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (query.length < 3) {
        if (query.length === 0) {
          setCountries(originCountries)
        } else {
          enqueueSnackbar({
            variant: "error",
            message: "Please enter more than 3 characters",
          });
        }
        
      } else {
        let filterdCountries = originCountries.filter((cuntry) => cuntry.countryName.toLowerCase().includes(query.toLowerCase()))
        setCountries(filterdCountries)
      }
    }
  }

  return (
    <div className='page'>
    	<div className="country-container">
        <div className="title-part">
          <div className="pageTitle">Country cost and currency table</div>
          <div>
            <MainButton title="Create New Estimate" onClick={handleImport} />
          </div>
        </div>
        <div className="serchBox-part">
          <SearchInput value={query} onChange={(event:any) => setQuery(event.target.value)} onKeyDown={handleSearch} />
        </div>
        {
          originCountries.length > 0 
          ? <div className="table-part">
            <table className="country-table">
              <tbody>
                <tr>
                  <th>No</th>
                  <th>Resident Country</th>
                  <th>Location index for consulting salaries</th>
                  <th>USD to LCU</th>
                  <th>(LCU) abbreviation</th>
                  <th>Action</th>
                </tr>
                {
                  countries.map((country, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{country.countryName}</td>
                        <td>{country.locationIndex === null ? "" : country.locationIndex.toFixed(2)}</td>
                        <td>{country.usdTolcu !== null && country.usdTolcu}</td>
                        <td>{country.lcuAbbreviation}</td>
                        <td>Edit</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          : <div>Please import the Countries' data</div>
        }
        
      </div>
    </div>
  )
}
