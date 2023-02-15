import React from 'react';
import axios from 'axios'
import * as XLSX from 'xlsx'

class App extends React.Component {


  exportXl = () => {
    axios.get('http://localhost:8080').then(function (response) {
      const transaction=response.data
      const formula=`SUM(L2:L${transaction.length+1})`;
      const formula2=`SUM(Q2:Q${transaction.length+1})`;
      const worksheet = XLSX.utils.json_to_sheet(transaction);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction");
      XLSX.utils.sheet_add_aoa(worksheet, [[
        {t: "n", f: formula}]], { origin: `L${transaction.length+2}` });
      XLSX.utils.sheet_add_aoa(worksheet, [[
          {t: "n", f: formula2}]], { origin: `Q${transaction.length+2}` });
      XLSX.writeFile(workbook, 'xlreact.xlsx')
    }).catch(function (error) {
      console.log(error)
    })
    
  }

  render() { 
    return (
      <button onClick={this.exportXl}></button>
    );
  }
}
 
export default App;