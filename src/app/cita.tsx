
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.0.10:3000';
const ID_NUTRIOLOGA = 2;

export default function Cita() {
  const hoy = new Date();

  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [disponibilidades, setDisponibilidades] = useState<any[]>([]);
  const [citas, setCitas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const anio = hoy.getFullYear();
  const mesActual = hoy.getMonth();

  const nombreMes = hoy.toLocaleDateString('es-MX', {
    month: 'long',
    year: 'numeric',
  });

  const primerDia = new Date(anio, mesActual, 1).getDay();
  const espacios = (primerDia + 6) % 7;
  const totalDias = new Date(anio, mesActual + 1, 0).getDate();

  const dias = [
    ...Array(espacios).fill(''),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  // Consultar disponibilidad de la nutrióloga
  useEffect(() => {
    const cargarDisponibilidad = async () => {
      try {
        const respuesta = await fetch(
          `${API_URL}/api/disponibilidad/${ID_NUTRIOLOGA}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error('Error al consultar horarios');
        }

        setDisponibilidades(Array.isArray(datos) ? datos : []);
        // Consultar las citas que ya están reservadas
const respuestaCitas = await fetch(
  `${API_URL}/api/citas/${ID_NUTRIOLOGA}`
);

const datosCitas = await respuestaCitas.json();

if (!respuestaCitas.ok) {
  throw new Error('No se pudieron consultar las citas.');
}

setCitas(Array.isArray(datosCitas) ? datosCitas : []);
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los horarios disponibles.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDisponibilidad();
  }, []);

  // Identificar el día de la semana
  const obtenerDiaSemana = (numero: number) => {
    const fecha = new Date(anio, mesActual, numero);

    return [
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
    ][fecha.getDay()];
  };

  // Generar horarios de una hora
  const obtenerHorarios = () => {
    if (!diaSeleccionado) return [];

    const diaSemana = obtenerDiaSemana(diaSeleccionado);

    const horariosDia = disponibilidades.filter(
      (item) =>
        item.dia_semana === diaSemana &&
        item.disponible === true
    );

    const resultado: { valor: string; etiqueta: string }[] = [];

    horariosDia.forEach((item) => {
      const inicio = new Date(item.hora_inicio);
      const fin = new Date(item.hora_fin);

      let minutosInicio =
        inicio.getHours() * 60 + inicio.getMinutes();

      const minutosFin =
        fin.getHours() * 60 + fin.getMinutes();

      while (minutosInicio + 60 <= minutosFin) {
        const hora = Math.floor(minutosInicio / 60);
        const minutos = minutosInicio % 60;

        const valor =
          `${String(hora).padStart(2, '0')}:` +
          `${String(minutos).padStart(2, '0')}`;

        const fechaHora = new Date(
          anio,
          mesActual,
          diaSeleccionado,
          hora,
          minutos
        );

        const etiqueta = fechaHora.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        resultado.push({ valor, etiqueta });
        minutosInicio += 60;
      }
    });

    return resultado;
  };

  const horarios = obtenerHorarios();
  
const fechaSeleccionada = diaSeleccionado
  ? `${anio}-${String(mesActual + 1).padStart(2, '0')}-${String(diaSeleccionado).padStart(2, '0')}`
  : '';

const horariosOcupados = citas
  .filter(
    (cita) =>
      cita.fecha === fechaSeleccionada &&
      ['pendiente', 'confirmada'].includes(cita.estado)
  )
  .map((cita) => {
    const [hora, minutos] = cita.hora.split(':').map(Number);

    // Ajustar la hora de MySQL a la hora local de Querétaro
    return `${String((hora + 18) % 24).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  });

const horariosDisponibles = horarios.filter(
  (hora) => !horariosOcupados.includes(hora.valor)
);

  
const confirmarCita = async () => {
  if (!diaSeleccionado || !horaSeleccionada) {
    Alert.alert('Atención', 'Selecciona un día y un horario.');
    return;
  }

  try {
    // Recuperar al estudiante que inició sesión
    const usuarioGuardado = await AsyncStorage.getItem('usuario');

    if (!usuarioGuardado) {
      Alert.alert('Error', 'No se encontró la sesión del usuario.');
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (usuario.rol !== 'estudiante') {
      Alert.alert('Acceso no permitido', 'Solo los estudiantes pueden agendar citas.');
      return;
    }

    // Preparar la fecha seleccionada
    const fecha = `${anio}-${String(mesActual + 1).padStart(2, '0')}-${String(diaSeleccionado).padStart(2, '0')}`;

    // Enviar la cita al backend
    const respuesta = await fetch(`${API_URL}/api/citas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: usuario.id_usuario,
        id_nutriologa: ID_NUTRIOLOGA,
        fecha,
        hora: horaSeleccionada,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudo registrar la cita.');
    }

    Alert.alert(
      '¡Cita registrada!',
      `Tu solicitud fue enviada correctamente.\n\nFecha: ${diaSeleccionado} de ${nombreMes}\nHora: ${horaSeleccionada}\nEstado: Pendiente`
    );

    setDiaSeleccionado(null);
    setHoraSeleccionada('');
    // Actualizar las citas registradas
const respuestaActualizada = await fetch(
  `${API_URL}/api/citas/${ID_NUTRIOLOGA}`
);

const citasActualizadas = await respuestaActualizada.json();

if (respuestaActualizada.ok) {
  setCitas(Array.isArray(citasActualizadas) ? citasActualizadas : []);
}

  } catch (error: any) {
    Alert.alert(
      'Error',
      error.message || 'No se pudo conectar con el servidor.'
    );
  }
};


  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Agendar cita
      </Text>

      <Text style={styles.subtitulo}>
        Agenda tu proxima cita
      </Text>

      <Image
        source={require('../../assets/images/troyanoCita.png')}
        style={styles.troyano}
        resizeMode="contain"
      />

      {/* Calendario */}
      <View style={styles.calendario}>

        <View style={styles.encabezadoCalendario}>
          <Text style={styles.mes}>
            {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
          </Text>
        </View>

        <View style={styles.filaSemana}>
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dia, index) => (
            <Text key={index} style={styles.diaSemana}>
              {dia}
            </Text>
          ))}
        </View>

        <View style={styles.dias}>
          {dias.map((dia, index) => {
            if (dia === '') {
              return <View key={index} style={styles.diaVacio} />;
            }

            const numero = Number(dia);
            const seleccionado = numero === diaSeleccionado;
            const diaSemana = obtenerDiaSemana(numero);

            const tieneDisponibilidad = disponibilidades.some(
              (item) =>
                item.dia_semana === diaSemana &&
                item.disponible === true
            );

            const fecha = new Date(anio, mesActual, numero);
            const fechaHoy = new Date(
              anio,
              mesActual,
              hoy.getDate()
            );

            const habilitado =
              tieneDisponibilidad && fecha >= fechaHoy;

            return (
              <TouchableOpacity
                key={index}
                disabled={!habilitado}
                style={[
                  styles.dia,
                  seleccionado && styles.diaSeleccionado,
                  !habilitado && { opacity: 0.3 },
                ]}
                onPress={() => {
                  setDiaSeleccionado(numero);
                  setHoraSeleccionada('');
                }}
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
        {cargando ? (
          <Text style={styles.textoHora}>
            Cargando horarios...
          </Text>
        ) : !diaSeleccionado ? (
          <Text style={styles.textoHora}>
            Selecciona un día disponible.
          </Text>
        ) : horariosDisponibles.length === 0 ? (
          <Text style={styles.textoHora}>
            No hay horarios disponibles para este día.
          </Text>
        ) : (
          horariosDisponibles.map((hora) => {
            const seleccionada = hora.valor === horaSeleccionada;

            return (
              <TouchableOpacity
                key={hora.valor}
                style={[
                  styles.botonHora,
                  seleccionada && styles.botonHoraSeleccionado,
                ]}
                onPress={() => setHoraSeleccionada(hora.valor)}
              >
                <Text
                  style={[
                    styles.textoHora,
                    seleccionada && styles.textoHoraSeleccionado,
                  ]}
                >
                  {hora.etiqueta}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

    
    
{/* Confirmar cita */}
<TouchableOpacity
  style={styles.botonConfirmar}
  onPress={confirmarCita}
>
  <Text style={styles.textoConfirmar}>
    Confirmar cita
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
    shadowOffset: { width: 0, height: 3 },
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
    shadowOffset: { width: 0, height: 3 },
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
