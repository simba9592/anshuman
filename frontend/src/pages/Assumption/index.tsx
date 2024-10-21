import React, { useState, useEffect } from 'react';
import MainButton from "../../components/mainButton"
import SearchInput from "../../components/searchInput"
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";
import { apis } from '../../apis';

type FileChangeEvent = React.ChangeEvent<HTMLInputElement>;
type ExcelFile = XLSX.WorkBook;

interface OriginalData {
  "Field Name": string;
  Variable: string;
}

interface TransformedData {
  fieldName: string;
  variable: number | null;
}

export default function ModelAssumptions() {
  const { enqueueSnackbar } = useSnackbar();
  const [originAssumptions, setOriginAssumptions] = useState<TransformedData[]>([])
  const [assumptions, setAssumptions] = useState<TransformedData[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      await apis.getAssumptions()
      .then((res) => {
        setAssumptions(res.data)
        setOriginAssumptions(res.data)
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
            Variable,
            "Field Name": FiledName,
          } = item;
        
          const variable = parseFloat(Variable.trim());
        
          return {
            variable: isNaN(variable) ? null : variable,
            fieldName: FiledName,
          };
        });
        setAssumptions(transformedData);
        setOriginAssumptions(transformedData)
        apis.createAssumptions(transformedData)
        .then((res) => {
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
          setAssumptions(originAssumptions)
        } else {
          enqueueSnackbar({
            variant: "error",
            message: "Please enter more than 3 characters",
          });
        }
        
      } else {
        let filterdAssumptions = originAssumptions.filter((cuntry) => cuntry.fieldName.toLowerCase().includes(query.toLowerCase()))
        setAssumptions(filterdAssumptions)
      }
    }
  }

  return (
    <div className='page'>
    	<div className="country-container">
        <div className="title-part">
          <div className="pageTitle">Currently cost and currency table</div>
          <div>
            <MainButton title="Create New Estimate" onClick={handleImport} />
          </div>
        </div>
        <div className="serchBox-part">
          <SearchInput value={query} onChange={(event:any) => setQuery(event.target.value)} onKeyDown={handleSearch} />
        </div>
        {
          originAssumptions.length > 0 
          ? <div className="table-part">
            <table className="country-table">
              <tbody>
                <tr>
                  <th>No</th>
                  <th>Field Name</th>
                  <th>Variable</th>
                  <th>Action</th>
                </tr>
                {
                  assumptions.map((assumption, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{assumption.fieldName}</td>
                        <td>{assumption.variable === null ? "" : assumption.variable.toFixed(2)}</td>
                        <td>Edit</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          : <div>Please import Model assumptions</div>
        }
        
      </div>
    </div>
  )
}
