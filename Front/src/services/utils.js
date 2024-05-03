module.exports = {
    replicateZeros(num, size) {
        num = num.toString()
        while (num.length < size) num = "0" + num
        return num
    },

    mask(v, setCpfMasked){
        v=v.replace(/\D/g,"")                    
        v=v.replace(/(\d{3})(\d)/,"$1.$2")       
        v=v.replace(/(\d{3})(\d)/,"$1.$2")    
                                                
        v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
        console.log(v)
        setCpfMasked(v)
    },

    removeCaracteres(v){
        return v.replace(/\D/g,"")   
    }
}