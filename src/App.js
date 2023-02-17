import React from 'react';
import axios from 'axios'
import * as XLSX from 'xlsx'

class App extends React.Component {
  constructor(){
    super()
    this.state={
      transaction:[],
      lastTotal:0
    }
  }

  assignCreditDebets = (data) => {
    return data.map((data, i) => {
      return data.status==='C' ?
      Object.assign(data,{jumlahkeluar:data.jumlah, jumlah:0, sum:0,  [this.state.lastTotal]:{t: "n", f:`K${i+1}+I${i+2}-J${i+2}`}}) :
      Object.assign(data,{jumlahkeluar:0, [this.state.lastTotal]:{t: "n", f:`K${i+1}+I${i+2}-J${i+2}`}})
    })
  }

  componentDidMount(){
    axios.post('http://localhost:8080/BKU',
    { bank:'BNI',
      firstDate: '2023-01-01',
      secondDate: '2023-01-31'
    }).then(response => response.data)
      .then(data => this.setState({transaction:data}))
      .catch(error => console.log(error))

      axios.post('http://localhost:8080/lastTotal',
      { bank:'BNI',
        firstDate: '2023-01-01',
        secondDate: '2023-01-31'
      }).then(response => response.data)
        .then(data => data[0].totalSum)
        .then(totalSum => this.setState({lastTotal:totalSum}))
        .catch(error => console.log(error)) 
  }

  exportXlBKU = () => {
    const transaction=this.assignCreditDebets(this.state.transaction)
    const formula=`SUM(I2:I${transaction.length+1})`
    const formula2=`SUM(J2:J${transaction.length+1})`
    const formula3=`K${transaction.length+1}`
    const worksheet = XLSX.utils.json_to_sheet(transaction);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction")
    XLSX.utils.sheet_add_aoa(worksheet, [[
      {t: "n", f: formula}]], { origin: `I${transaction.length+2}` })
    XLSX.utils.sheet_add_aoa(worksheet, [[
      {t: "n", f: formula2}]], { origin: `J${transaction.length+2}` })
    XLSX.utils.sheet_add_aoa(worksheet, [[
      {t: "n", f: formula3}]], { origin: `K${transaction.length+2}` })
    XLSX.writeFile(workbook, 'xlreact.xlsx')
  } 

  render() { 
    return (
      <button onClick={this.exportXlBKU}></button>
    );
  }
}
 
export default App;