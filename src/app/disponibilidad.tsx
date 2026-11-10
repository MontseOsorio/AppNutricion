
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { useEffect, useState } from 'react';

const API_URL = 'http://192.168.0.10:3000';
const ID_NUTRIOLOGA = 2;

const dias = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
];

export default function Disponibilidad() {
  const [dia, setDia] = useState('lunes');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('13:00');
  const [horarios, setHorarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const consultarHorarios = async () => {
    try {
      const respuesta = await fetch(
        `${API_URL}/api/disponibilidad/${ID_NUTRIOLOGA}`
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar los horarios');
      }

      setHorarios(datos);
    } catch (error) {
      console.log('ERROR AL CONSULTAR:', error);
      Alert.alert(
        'Error',
        'No fue posible cargar los horarios.'
      );
    }
  };

  useEffect(() => {
    consultarHorarios();
  }, []);

  const guardarHorario = async () => {
    if (!horaInicio.trim() || !horaFin.trim()) {
      Alert.alert('Campos incompletos', 'Ingresa ambas horas.');
      return;
    }

    const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!formatoHora.test(horaInicio) || !formatoHora.test(horaFin)) {
      Alert.alert('Horario incorrecto', 'Usa el formato HH:MM, por ejemplo 09:00.');
      return;
    }

    if (horaInicio >= horaFin) {
      Alert.alert(
        'Horario incorrecto',
        'La hora de inicio debe ser anterior a la hora final.'
      );
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        `${API_URL}/api/disponibilidad`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_nutriologa: ID_NUTRIOLOGA,
            dia_semana: dia,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo guardar el horario.');
      }

      Alert.alert('¡Listo!', 'El horario se guardó correctamente.');

      await consultarHorarios();

    } catch (error: any) {
      console.log('ERROR AL GUARDAR:', error);
      Alert.alert('Error', error.message || 'No fue posible guardar el horario.');
    } finally {
      setCargando(false);
    }
  };

  const mostrarHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const nombreDia = (valor: string) => {
    return valor.charAt(0).toUpperCase() + valor.slice(1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity
        style={styles.regresar}
        onPress={() => router.back()}
      >
        <Text style={styles.textoRegresar}>‹ Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Mi disponibilidad 📅</Text>

      <Text style={styles.subtitulo}>
        Configura los días y horarios en los que atenderás
        a los estudiantes.
      </Text>

      <View style={styles.tarjeta}>

        <Text style={styles.etiqueta}>Selecciona un día</Text>

        <View style={styles.dias}>
          {dias.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.botonDia,
                dia === item && styles.diaActivo,
              ]}
              onPress={() => setDia(item)}
            >
              <Text
                style={[
                  styles.textoDia,
                  dia === item && styles.textoDiaActivo,
                ]}
              >
                {item.substring(0, 3).toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.etiqueta}>Hora de inicio</Text>

        <TextInput
          style={styles.input}
          value={horaInicio}
          onChangeText={setHoraInicio}
          placeholder="Ej. 09:00"
          keyboardType="numbers-and-punctuation"
          maxLength={5}
        />

        <Text style={styles.etiqueta}>Hora de finalización</Text>

        <TextInput
          style={styles.input}
          value={horaFin}
          onChangeText={setHoraFin}
          placeholder="Ej. 13:00"
          keyboardType="numbers-and-punctuation"
          maxLength={5}
        />

        <TouchableOpacity
          style={[
            styles.botonGuardar,
            cargando && styles.deshabilitado,
          ]}
          onPress={guardarHorario}
          disabled={cargando}
        >
          <Text style={styles.textoGuardar}>
            {cargando ? 'Guardando...' : 'Guardar disponibilidad'}
          </Text>
        </TouchableOpacity>

      </View>

      <Text style={styles.tituloLista}>Mis horarios registrados</Text>

      {horarios.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.iconoVacio}>🗓️</Text>
          <Text style={styles.textoVacio}>
            Todavía no tienes horarios registrados.
          </Text>
        </View>
      ) : (
        horarios.map((item) => (
          <View
            key={item.id_disponibilidad}
            style={styles.horario}
          >
            <View>
              <Text style={styles.nombreHorario}>
                {nombreDia(item.dia_semana)}
              </Text>
              <Text style={styles.horaHorario}>
                {mostrarHora(item.hora_inicio)} - {mostrarHora(item.hora_fin)}
              </Text>
            </View>

            <Text style={styles.estado}>
              {item.disponible ? '✓ Activo' : 'Inactivo'}
            </Text>
          </View>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    padding: 22,
    paddingTop: 50,
  },
  regresar: {
    marginBottom: 20,
  },
  textoRegresar: {
    fontSize: 16,
    color: '#1F416A',
    fontWeight: '700',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 7,
    marginBottom: 22,
    lineHeight: 21,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },
  etiqueta: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F416A',
    marginBottom: 10,
    marginTop: 12,
  },
  dias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 12,
  },
  botonDia: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#EEF3F7',
    alignItems: 'center',
  },
  diaActivo: {
    backgroundColor: '#4089C0',
  },
  textoDia: {
    color: '#1F416A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  textoDiaActivo: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 15,
    color: '#333',
    fontSize: 15,
  },
  botonGuardar: {
    backgroundColor: '#4089C0',
    padding: 15,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 22,
  },
  deshabilitado: {
    opacity: 0.6,
  },
  textoGuardar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F416A',
    marginTop: 28,
    marginBottom: 15,
  },
  horario: {
    backgroundColor: '#fff',
    padding: 17,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  nombreHorario: {
    color: '#1F416A',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  horaHorario: {
    color: '#666',
    marginTop: 5,
    fontSize: 14,
  },
  estado: {
    color: '#32865A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  vacio: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  iconoVacio: {
    fontSize: 30,
    marginBottom: 8,
  },
  textoVacio: {
    color: '#777',
    textAlign: 'center',
  },
});
