let item=[]
for (let i = 0; i<=25; i++) {
    item.push({
        tgl:`${i+1}/01/2023`,
        uraian:`transaksi${i}`,
        Jumlah:500*i
        }
    )       
}

export const Transaction=item