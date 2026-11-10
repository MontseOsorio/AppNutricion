
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useEffect, useState } from 'react';

const API_URL = 'http://192.168.0.10:3000';
const ID_NUTRIOLOGA = 2;

type Cita = {
  id_cita: number;
  fecha: string;
  hora: string;
  estado: string;
  motivo: string | null;
  nombre: string;
  apellidos: string;
  correo: string;
};

export default function CitasNutriologa() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarCitas = async () => {
    try {
      const respuesta = await fetch(
        `${API_URL}/api/citas/${ID_NUTRIOLOGA}`
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar las citas.');
      }

      setCitas(Array.isArray(datos) ? datos : []);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo conectar con el servidor.'
      );
    } finally {
      setCargando(false);
    }
  };
  
const cambiarEstado = async (
  idCita: number,
  estado: 'confirmada' | 'cancelada'
) => {
  const accion = estado === 'confirmada' ? 'confirmar' : 'cancelar';

  try {
    const respuesta = await fetch(
      `${API_URL}/api/citas/${ID_NUTRIOLOGA}/${idCita}/estado`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudo actualizar la cita.');
    }

    Alert.alert(
      '¡Listo!',
      estado === 'confirmada'
        ? 'La cita fue confirmada correctamente.'
        : 'La cita fue cancelada correctamente.'
    );

    cargarCitas();

  } catch (error: any) {
    Alert.alert('Error', error.message);
  }
};

  useEffect(() => {
    cargarCitas();
  }, []);

  const mostrarHora = (hora: string) => {
    return hora.slice(0, 5);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Citas de estudiantes 🩺</Text>

      <Text style={styles.subtitulo}>
        Consulta las solicitudes de atención.
      </Text>

      {cargando ? (
        <Text style={styles.mensaje}>Cargando citas...</Text>
      ) : citas.length === 0 ? (
        <Text style={styles.mensaje}>
          Todavía no hay citas registradas.
        </Text>
      ) : (
        citas.map((cita) => (
          <View key={cita.id_cita} style={styles.tarjeta}>
            <Text style={styles.nombre}>
              {cita.nombre} {cita.apellidos}
            </Text>

            <Text style={styles.dato}>
              📅 Fecha: {cita.fecha}
            </Text>

            <Text style={styles.dato}>
              🕒 Hora: {mostrarHora(cita.hora)}
            </Text>

            <Text style={styles.dato}>
              ✉️ Correo: {cita.correo}
            </Text>

            {cita.motivo ? (
              <Text style={styles.dato}>
                Motivo: {cita.motivo}
              </Text>
            ) : null}

            <Text style={styles.estado}>
              Estado: {cita.estado}
            </Text>
            
{cita.estado === 'pendiente' && (
  <View style={styles.botonesAccion}>
    <TouchableOpacity
      style={styles.botonConfirmar}
      onPress={() => cambiarEstado(cita.id_cita, 'confirmada')}
    >
      <Text style={styles.textoBoton}>Confirmar cita</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.botonCancelar}
      onPress={() => cambiarEstado(cita.id_cita, 'cancelada')}
    >
      <Text style={styles.textoBoton}>Cancelar cita</Text>
    </TouchableOpacity>
  </View>
)}

          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.boton}
        onPress={cargarCitas}
      >
        <Text style={styles.textoBoton}>Actualizar citas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    padding: 22,
    paddingTop: 55,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 15,
    color: '#555',
    marginTop: 5,
    marginBottom: 22,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F416A',
    marginBottom: 12,
  },
  dato: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  estado: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4089C0',
    marginTop: 8,
  },
  mensaje: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 30,
  },
  boton: {
    backgroundColor: '#4089C0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
botonesAccion: {
  marginTop: 12,
  gap: 10,
},
botonConfirmar: {
  backgroundColor: '#4089C0',
  padding: 12,
  borderRadius: 12,
  alignItems: 'center',
},
botonCancelar: {
  backgroundColor: '#C96B6B',
  padding: 12,
  borderRadius: 12,
  alignItems: 'center',
},

});
