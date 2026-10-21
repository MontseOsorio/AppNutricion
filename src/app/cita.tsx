
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { useState } from 'react';
export default function Cita() {

  const [diaSeleccionado, setDiaSeleccionado] = useState(23);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');

  const dias = [
    '',
    '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11', '12', '13',
    '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27',
    '28', '29', '30',
  ];

  const horarios = [
    '10:00 AM',
    '12:00 PM',
    '2:00 PM',
    '4:00 PM',
    '6:00 PM',
  ];

  return (
    <View style={styles.container}>

      {/* Título */}
      <Text style={styles.titulo}>
        Agendar cita
      </Text>

      <Text style={styles.subtitulo}>
      Agenda tu proxima cita
      </Text>

      {/* Troyano */}
      <Image
        source={require('../../assets/images/troyanoCita.png')}
        style={styles.troyano}
        resizeMode="contain"
      />

      {/* Calendario */}
      <View style={styles.calendario}>

        <View style={styles.encabezadoCalendario}>
          <Text style={styles.mes}>
            Septiembre 2026
          </Text>
        </View>

        {/* Días de la semana */}
        <View style={styles.filaSemana}>

          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dia, index) => (
            <Text key={index} style={styles.diaSemana}>
              {dia}
            </Text>
          ))}

        </View>

        {/* Días */}
        <View style={styles.dias}>

          {dias.map((dia, index) => {

            if (dia === '') {
              return (
                <View
                  key={index}
                  style={styles.diaVacio}
                />
              );
            }

            const numero = Number(dia);
            const seleccionado = numero === diaSeleccionado;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dia,
                  seleccionado && styles.diaSeleccionado,
                ]}
                onPress={() => setDiaSeleccionado(numero)}
              >

                <Text
                  style={[
                    styles.textoDia,
                    seleccionado && styles.textoDiaSeleccionado,
                  ]}
                >
                  {dia}
                </Text>

              </TouchableOpacity>
            );
          })}

        </View>

      </View>

      {/* Horarios */}
      <Text style={styles.tituloHorario}>
        Selecciona un horario
      </Text>

      <View style={styles.horarios}>

        {horarios.map((hora) => {

          const seleccionada = hora === horaSeleccionada;

          return (
            <TouchableOpacity
              key={hora}
              style={[
                styles.botonHora,
                seleccionada && styles.botonHoraSeleccionado,
              ]}
              onPress={() => setHoraSeleccionada(hora)}
            >

              <Text
                style={[
                  styles.textoHora,
                  seleccionada && styles.textoHoraSeleccionado,
                ]}
              >
                {hora}
              </Text>

            </TouchableOpacity>
          );
        })}

      </View>

      {/* Botón confirmar */}
      <TouchableOpacity
        style={styles.botonConfirmar}
        onPress={() => {
          if (horaSeleccionada) {
            console.log(
              `Cita seleccionada: ${diaSeleccionado} de septiembre a las ${horaSeleccionada}`
            );
          }
        }}
      >

       ```tsx
{/* Botón confirmar */}
<TouchableOpacity
  style={styles.botonConfirmar}
  onPress={() => router.push('/sustituciones')}
>
  <Text style={styles.textoConfirmar}>
    Confirmar cita
  </Text>
</TouchableOpacity>
```


      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
    paddingHorizontal: 22,
    paddingTop: 45,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F416A',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 2,
  },

  troyano: {
    width: 300,
    height: 180,
    alignSelf: 'center',
    marginVertical: 5,
  },

  calendario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  encabezadoCalendario: {
    alignItems: 'center',
    marginBottom: 12,
  },

  mes: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F416A',
  },

  filaSemana: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },

  diaSemana: {
    width: '14.2%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: '#888888',
  },

  dias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dia: {
    width: '14.2%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },

  diaVacio: {
    width: '14.2%',
    height: 32,
  },

  diaSeleccionado: {
    backgroundColor: '#4089C0',
  },

  textoDia: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
  },

  textoDiaSeleccionado: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  tituloHorario: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
  },

  horarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },

  botonHora: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8D8D8',
  },

  botonHoraSeleccionado: {
    backgroundColor: '#4089C0',
    borderColor: '#4089C0',
  },

  textoHora: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555555',
  },

  textoHoraSeleccionado: {
    color: '#FFFFFF',
  },

  botonConfirmar: {
    backgroundColor: '#4089C0',
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },

  textoConfirmar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

});
