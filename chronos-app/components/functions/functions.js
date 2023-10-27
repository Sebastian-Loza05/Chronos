export default function compararHoras(a,b){
  const horaA= a.start_time;
  const horaB= b.start_time;
  if (horaA < horaB) {
    return -1;
  }
  if (horaA > horaB) {
    return 1;
  }
  return 0;
}
