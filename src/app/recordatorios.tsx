
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';


import { useState } from 'react';

export default function Recordatorios() {

  const [tomas, setTomas] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const horarios = [
    '8:00 AM',
    '10:00 AM',
    '12:00 PM',
    '2:00 PM',
    '4:00 PM',
    '6:00 PM',
    '8:00 PM',
    '10:00 PM',
  ];

  const registrarAgua = (index: number) => {
    const nuevasTomas = [...tomas];
    nuevasTomas[index] = !nuevasTomas[index];
    setTomas(nuevasTomas);
  };

  const totalTomadas = tomas.filter(Boolean).length;

  return (
    <View style={styles.container}>
        

      {/* Título */}
      <Text style={styles.titulo}>
        Recordatorios
      </Text>

      <Text style={styles.subtitulo}>
        Mantente hidratado durante el día 
      </Text>

      {/* Tarjeta de progreso */}
      <View style={styles.tarjetaProgreso}>

        <Text style={styles.tituloProgreso}>
          Tu hidratación de hoy
        </Text>

        <Text style={styles.numeroProgreso}>
          {totalTomadas} <Text style={styles.de}>de</Text> 8
        </Text>

        <Text style={styles.textoProgreso}>
          tomas registradas
        </Text>

        <View style={styles.barra}>
          <View
            style={[
              styles.progreso,
              { width: `${(totalTomadas / 8) * 100}%` },
            ]}
          />
        </View>

      </View>

      {/* Troyano con sed */}
      <Image
        source={require('../../assets/images/troyanoSed.png')}
        style={styles.troyanoSed}
        resizeMode="contain"
      />

      {/* Botellas */}
      <View style={styles.contenedorBotellas}>

        {tomas.map((tomada, index) => (

          <TouchableOpacity
            key={index}
            style={styles.toma}
            onPress={() => registrarAgua(index)}
            activeOpacity={0.7}
          >

            <View
              style={[
                styles.botella,
                tomada
                  ? styles.botellaAzul
                  : styles.botellaGris,
              ]}
            >

              <View
                style={[
                  styles.tapa,
                  tomada
                    ? styles.tapaAzul
                    : styles.tapaGris,
                ]}
              />

              {tomada && (
                <View style={styles.agua}>
                  <Text style={styles.check}>
                    ✓
                  </Text>
                </View>
              )}

            </View>

            <Text style={styles.horario}>
              {horarios[index]}
            </Text>

            <Text
              style={[
                styles.estado,
                tomada
                  ? styles.estadoTomada
                  : styles.estadoPendiente,
              ]}
            >
              {tomada ? 'Tomada ✓' : 'Pendiente'}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

{/* Botón para agendar cita */}
<TouchableOpacity
  style={styles.botonCita}
  onPress={() => router.push('/cita')}
>
  <Text style={styles.botonCitaTexto}>
    📅 Agendar cita
  </Text>
</TouchableOpacity>



    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
    paddingHorizontal: 22,
    paddingTop: 55,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F416A',
    textAlign: 'center',
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 22,
  },

  tarjetaProgreso: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  tituloProgreso: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },

  numeroProgreso: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4089C0',
    textAlign: 'center',
    marginTop: 5,
  },

  de: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777777',
  },

  textoProgreso: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 12,
  },

  barra: {
    width: '100%',
    height: 7,
    backgroundColor: '#E4E4E4',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progreso: {
    height: '100%',
    backgroundColor: '#4089C0',
    borderRadius: 10,
  },

  /* Troyano con sed */
  troyanoSed: {
    width: 700,
    height: 240,
    alignSelf: 'center',
    marginVertical: 3,
  },

  contenedorBotellas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  toma: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 10,
  },

  botella: {
    width: 35,
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },

  botellaGris: {
    backgroundColor: '#D5D5D5',
    borderColor: '#BDBDBD',
  },

  botellaAzul: {
    backgroundColor: '#6DB3DF',
    borderColor: '#4089C0',
  },

  tapa: {
    position: 'absolute',
    top: -7,
    width: 19,
    height: 9,
    borderRadius: 4,
  },

  tapaGris: {
    backgroundColor: '#BDBDBD',
  },

  tapaAzul: {
    backgroundColor: '#4089C0',
  },

  agua: {
    width: '100%',
    height: '65%',
    backgroundColor: '#4089C0',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  check: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  horario: {
    fontSize: 11,
    fontWeight: '700',
    color: '#444444',
  },

  estado: {
    fontSize: 9,
    marginTop: 2,
  },

  estadoTomada: {
    color: '#4089C0',
    fontWeight: '700',
  },

  estadoPendiente: {
    color: '#999999',
  },

  mensaje: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 5,
  },

  mensajeTexto: {
    textAlign: 'center',
    fontSize: 11,
    color: '#777777',
  },

});
