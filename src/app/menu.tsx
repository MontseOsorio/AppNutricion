import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Menu() {
  const [plan, setPlan] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [diaSeleccionado, setDiaSeleccionado] = useState(1);
  const [comidasAbiertas, setComidasAbiertas] = useState({
    desayuno: true,
    colacion: false,
    comida: false,
    cena: false,
  });
  const API_URL = 'http://192.168.0.10:3000';
  const diasSemana = [
  { id: 1, nombre: 'Lun' },
  { id: 2, nombre: 'Mar' },
  { id: 3, nombre: 'Mié' },
  { id: 4, nombre: 'Jue' },
  { id: 5, nombre: 'Vie' },
];
  useEffect(() => {
    const cargarMenu = async () => {
      try {
        const usuarioGuardado = await AsyncStorage.getItem('usuario');

        if (!usuarioGuardado) {
          Alert.alert('Sesión no encontrada', 'Inicia sesión nuevamente.');
          return;
        }

        const usuario = JSON.parse(usuarioGuardado);

        const respuesta = await fetch(
          `${API_URL}/api/planes/estudiante/${usuario.id_usuario}`
        );

        if (!respuesta.ok) {
          throw new Error('No se pudo consultar el menú.');
        }

        const planes = await respuesta.json();

        const planPublicado = planes.find(
          (p: any) => p.estado === 'activo'
        );

        setPlan(planPublicado || null);

      } catch (error) {
        console.error('Error al cargar menú:', error);
        Alert.alert('Error', 'No se pudo cargar tu menú.');
      } finally {
        setCargando(false);
      }
    };

    cargarMenu();
  }, []);
  const cambiarComida = (comida: string) => {
    setComidasAbiertas({
      ...comidasAbiertas,
      [comida]: !comidasAbiertas[
        comida as keyof typeof comidasAbiertas
      ],
    });
  };

    
const mostrarComida = (
  titulo: string,
  comida: string,
  tipo: string
) => {
  const abierta =
    comidasAbiertas[
      comida as keyof typeof comidasAbiertas
    ];

  const comidasDelDia = plan?.comidas?.filter(
    (c: any) =>
      c.tipo === tipo &&
      Number(c.dia_plan) === diaSeleccionado
  ) || [];

  return (
    <View style={styles.tarjetaComida}>
      <TouchableOpacity
        style={styles.encabezadoComida}
        onPress={() => cambiarComida(comida)}
        activeOpacity={0.7}
      >
        <Text style={styles.tituloComida}>
          {titulo}
        </Text>

        <View style={styles.ladoDerecho}>
          <Text style={styles.flecha}>
            {abierta ? '▲' : '▼'}
          </Text>
        </View>
      </TouchableOpacity>

      {abierta && (
        <View style={styles.listaAlimentos}>
          {comidasDelDia.length === 0 ? (
            <Text style={styles.textoSinComida}>
              No tienes alimentos registrados para este tiempo de comida. 🥗
            </Text>
          ) : (
            comidasDelDia.map((c: any) => (
              <View key={c.id_comida}>
                {c.detalle_comidas.map((detalle: any) => (
                  <View
                    key={detalle.id_detalle_comida}
                    style={styles.alimento}
                  >
                    <Text style={styles.punto}>•</Text>

                    <Text style={styles.textoAlimento}>
                      {detalle.alimento.nombre} - {detalle.cantidad} {detalle.unidad}
                    </Text>
                  </View>
                ))}

                {c.instrucciones ? (
                  <Text style={styles.textoAlimento}>
                    Indicaciones: {c.instrucciones}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};


  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* Título */}
        <Text style={styles.titulo}>
          Mi menú
        </Text>

        <Text style={styles.subtitulo}>
          Tu alimentación para hoy
        </Text>

        {/* Botón de perfil */}
        <TouchableOpacity
          style={styles.botonPerfil}
          onPress={() => router.push('/perfil')}
          activeOpacity={0.7}
        >

          <Text style={styles.iconoPerfil}>
            👤
          </Text>

          <Text style={styles.textoPerfil}>
            Mi perfil
          </Text>

          <Text style={styles.flechaPerfil}>
            ›
          </Text>

        </TouchableOpacity>

        {/* NUEVO: Botón de cocina */}
        <TouchableOpacity
          style={styles.botonCocina}
          onPress={() => router.push('/cocina')}
          activeOpacity={0.7}
        >

          <Text style={styles.iconoCocina}>
            🍳
          </Text>

          <View style={styles.contenidoCocina}>

            <Text style={styles.textoCocina}>
              Mi cocina
            </Text>

            <Text style={styles.subtextoCocina}>
              Selecciona los aparatos que tienes en casa
            </Text>

          </View>

          <Text style={styles.flechaCocina}>
            ›
          </Text>

        </TouchableOpacity>

        {/* Plato nutritivo */}
        <Image
          source={require('../../assets/images/PlatoNutritivo.png')}
          style={styles.plato}
          resizeMode="contain"
        />



{/* BOTÓN MENÚ DE CAFETERÍA */}
<TouchableOpacity
  style={{
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
  }}
  onPress={() => router.push('/menu_cafeteria')}
>
  <Text style={{ color: '#1F416A', fontWeight: '800' }}>
    🍽️ Menú de cafetería
  </Text>
</TouchableOpacity>

        {/* Resumen de calorías */}
        <View style={styles.tarjetaCalorias}>

          <View>
            <Text style={styles.textoResumen}>
              Consumo del día
            </Text>

            <Text style={styles.subtextoResumen}>
              Meta estimada
            </Text>
          </View>

          <View style={styles.caloriasTotales}>
            <Text style={styles.numeroCalorias}>
  {plan?.calorias_objetivo
    ? plan.calorias_objetivo.toLocaleString('es-MX')
    : '--'}
</Text>

            <Text style={styles.kcal}>
              kcal
            </Text>
          </View>

        </View>
                {cargando ? (
          <ActivityIndicator size="large" color="#4089C0" />
        ) : !plan ? (
          <View style={styles.mensaje}>
            <Text style={styles.mensajeTexto}>
              Aún no tienes un menú publicado.
            </Text>
            <Text style={styles.mensajeSubtexto}>
              Cuando tu nutrióloga publique tu plan, aparecerá aquí.
            </Text>
          </View>
       ) : (
  <>
    <View style={styles.contenedorDias}>
      {diasSemana.map((dia) => (
        <TouchableOpacity
          key={dia.id}
          style={[
            styles.botonDia,
            diaSeleccionado === dia.id && styles.botonDiaActivo,
          ]}
          onPress={() => setDiaSeleccionado(dia.id)}
        >
          <Text
            style={[
              styles.textoDia,
              diaSeleccionado === dia.id && styles.textoDiaActivo,
            ]}
          >
            {dia.nombre}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {mostrarComida('☀️ Desayuno', 'desayuno', 'desayuno')}
    {mostrarComida('🍎 Colación', 'colacion', 'colacion')}
    {mostrarComida('🍽️ Comida', 'comida', 'comida')}
    {mostrarComida('🌙 Cena', 'cena', 'cena')}
  </>
)}
        
       {/* Mensaje */}
{plan && (
  <View style={styles.mensaje}>
    <Text style={styles.mensajeTexto}>
      ¡Vas muy bien, no te rindas!
    </Text>

    <Text style={styles.mensajeSubtexto}>
      Sigue tu plan y mantente hidratado.
    </Text>
  </View>
)}

      </ScrollView>
         
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
  },

  scroll: {
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 30,
  },

  titulo: {
    fontSize: 29,
    fontWeight: '800',
    color: '#1F416A',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitulo: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },

  plato: {
    width: 190,
    height: 150,
    alignSelf: 'center',
    marginVertical: -3,
  },

  tarjetaCalorias: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 17,
    marginBottom: 14,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  textoResumen: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
  },

  subtextoResumen: {
    fontSize: 11,
    color: '#888888',
    marginTop: 3,
  },

  caloriasTotales: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  numeroCalorias: {
    fontSize: 23,
    fontWeight: '800',
    color: '#4089C0',
  },

  kcal: {
    fontSize: 11,
    color: '#777777',
    marginLeft: 4,
    marginBottom: 3,
  },

  tarjetaComida: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    marginBottom: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,

    overflow: 'hidden',
  },

  encabezadoComida: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  tituloComida: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F416A',
  },

  ladoDerecho: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  caloriasPequenas: {
    fontSize: 10,
    color: '#888888',
    marginRight: 10,
  },

  flecha: {
    fontSize: 11,
    color: '#4089C0',
    fontWeight: '800',
  },

  listaAlimentos: {
    paddingHorizontal: 16,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  alimento: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },

  punto: {
    fontSize: 16,
    color: '#4089C0',
    marginRight: 8,
  },

  textoAlimento: {
    fontSize: 12,
    color: '#555555',
  },

  calorias: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4089C0',
    marginTop: 5,
  },

  mensaje: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    marginTop: 2,
  },

  mensajeTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4089C0',
  },

  mensajeSubtexto: {
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
  },

  botonPerfil: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginTop: 15,
    marginBottom: 3,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  iconoPerfil: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#dcecf8',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    marginRight: 10,
  },

  textoPerfil: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#1F416A',
  },

  flechaPerfil: {
    fontSize: 27,
    color: '#4089C0',
  },

  /* NUEVOS ESTILOS PARA EL BOTÓN DE COCINA */
  botonCocina: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginTop: 10,
    marginBottom: 8,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  iconoCocina: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#e5eedf',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    marginRight: 10,
    overflow: 'hidden',
    paddingTop: 7,
  },

  contenidoCocina: {
    flex: 1,
  },

  textoCocina: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F416A',
  },

  subtextoCocina: {
    fontSize: 11,
    color: '#777777',
    marginTop: 3,
  },

  flechaCocina: {
    fontSize: 27,
    color: '#4089C0',
    marginLeft: 8,
  },
  contenedorDias: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 18,
  marginTop: 8,
  gap: 8,
},

botonDia: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: 15,
  paddingVertical: 12,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#DCE5EC',
},

botonDiaActivo: {
  backgroundColor: '#4089C0',
  borderColor: '#4089C0',
},

textoDia: {
  fontSize: 13,
  fontWeight: '700',
  color: '#1F416A',
},

textoDiaActivo: {
  color: '#FFFFFF',
},
textoSinComida: {
  fontSize: 12,
  color: '#888888',
  textAlign: 'center',
  paddingVertical: 12,
},
});


